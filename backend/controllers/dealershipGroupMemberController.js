import DealershipGroupMember from "../models/DealershipGroupMember.js";
import DealershipGroup from "../models/DealershipGroup.js";
import Dealership from "../models/Dealership.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendEmail, buildDealershipTokenEmail } from "../utils/emailService.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

// @desc    Join a dealership group
// @route   POST /api/dealership-group-members/join/:dealershipId
// @access  Private/Buyer
export const joinGroup = async (req, res) => {
    try {
        const { dealershipId } = req.params;
        const { paymentIntentId } = req.body;
        const buyerId = req.user._id;

        // Find dealership and populate current group
        let dealership = await Dealership.findById(dealershipId).populate("currentGroup");

        if (!dealership) {
            return res.status(404).json({ message: "Dealership not found" });
        }

        if (!paymentIntentId) {
            return res.status(400).json({ message: "Payment confirmation is required to join the group." });
        }

        // Verify the payment intent
        let paymentIntent;
        try {
            paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            return res.status(400).json({ message: "Invalid payment intent." });
        }

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "Payment has not succeeded." });
        }

        // If there's no active group, create one! This is different from Properties
        // But let's follow the standard pattern: If no active group exists, create it.
        if (!dealership.currentGroup) {
            const newGroup = await DealershipGroup.create({
                dealership: dealershipId,
                status: "OPEN",
            });
            // Link group to dealership
            dealership.currentGroup = newGroup._id;

            // Set joining deadline to 30 days from now if not exists
            if (!dealership.groupJoiningDeadline) {
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 30);
                dealership.groupJoiningDeadline = deadline;
            }
            await dealership.save();
            dealership = await Dealership.findById(dealershipId).populate("currentGroup");
        }

        const group = dealership.currentGroup;

        // Check if group is open
        if (group.status !== "OPEN" && group.status !== "QUALIFIED") {
            return res.status(400).json({
                message: `Cannot join group with status: ${group.status}`
            });
        }

        // Check deadline
        if (dealership.groupJoiningDeadline && new Date() > new Date(dealership.groupJoiningDeadline)) {
            return res.status(400).json({ message: "Group joining deadline has passed" });
        }

        // Check if buyer already joined
        const existingMember = await DealershipGroupMember.findOne({
            group: group._id,
            buyer: buyerId
        });

        if (existingMember) {
            return res.status(400).json({ message: "You have already joined this group" });
        }

        // Check if group has reached maximum size
        // We will assume no max size for dealerships, or same as minimum? Property checks for max size reached by using minimumGroupSize, which is a bit weird. Wait, Property checking logic:
        /*
        const currentMemberCount = group.members.length;
        if (currentMemberCount >= property.minimumGroupSize) {
            return res.status(400).json({
                message: "Group is already full. Maximum size reached."
            });
        }
        */
        // I won't limit max size for now for dealerships, just warn if someone wants to. Oh, property does limit it. I'll mirror it exactly to avoid inconsistencies.
        const currentMemberCount = group.members.length;
        if (currentMemberCount >= dealership.minimumGroupSize) {
            return res.status(400).json({
                message: "Group is already full. Maximum size reached."
            });
        }

        // Create group member (token auto-set to PAID - simulated payment)
        const member = await DealershipGroupMember.create({
            group: group._id,
            buyer: buyerId,
            tokenStatus: "PAID",
        });

        // Add member to group
        group.members.push(member._id);
        await group.save();

        // Check if group now qualifies
        await group.checkQualification();

        const populatedMember = await DealershipGroupMember.findById(member._id)
            .populate("buyer", "name email")
            .populate({
                path: "group",
                populate: {
                    path: "dealership",
                    populate: { path: "city" }
                }
            });

        // -------------------------
        // Disptach Automated Email
        // -------------------------
        try {
            const htmlContent = buildDealershipTokenEmail(
                populatedMember.buyer.name,
                populatedMember.group.dealership.vehicleModels.join(", "), // or fallback if array
                populatedMember.group.dealership.name,
                populatedMember.group.dealership.tokenAmount
            );
            
            // Fire and forget (asynchronous)
            sendEmail({
                to: populatedMember.buyer.email,
                subject: `Vehicle Booking Successful - ${populatedMember.group.dealership.name}`,
                html: htmlContent
            }).catch(emailErr => {
                console.error("Non-fatal: Failed to send booking email in background:", emailErr);
            });
        } catch (err) {
            console.error("Non-fatal: Synchronous error in email preparation:", err);
        }

        res.status(201).json({
            message: "Successfully joined group",
            member: populatedMember,
            groupStatus: group.status,
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already joined this group" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all groups current buyer has joined
// @route   GET /api/dealership-group-members/my-groups
// @access  Private/Buyer
export const getMyGroups = async (req, res) => {
    try {
        const buyerId = req.user._id;

        const memberships = await DealershipGroupMember.find({ buyer: buyerId })
            .populate({
                path: "group",
                populate: {
                    path: "dealership",
                    populate: { path: "city" }
                }
            })
            .sort({ joinedAt: -1 });

        res.json(memberships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get group status and details
// @route   GET /api/dealership-group-members/status/:groupId
// @access  Private/Buyer
export const getGroupStatus = async (req, res) => {
    try {
        const { groupId } = req.params;
        const buyerId = req.user._id;

        const group = await DealershipGroup.findById(groupId)
            .populate({
                path: "dealership",
                populate: { path: "city" }
            })
            .populate({
                path: "members",
                populate: { path: "buyer", select: "name email" }
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if buyer is a member
        const membership = await DealershipGroupMember.findOne({
            group: groupId,
            buyer: buyerId
        });

        res.json({
            group,
            isMember: !!membership,
            membershipDetails: membership,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
