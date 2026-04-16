import GroupMember from "../models/GroupMember.js";
import PropertyGroup from "../models/PropertyGroup.js";
import Property from "../models/Property.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendEmail, buildPropertyTokenEmail } from "../utils/emailService.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

// @desc    Join a property group
// @route   POST /api/group-members/join/:propertyId
// @access  Private/Buyer
export const joinGroup = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { paymentIntentId } = req.body;
        const buyerId = req.user._id;

        // Find property and populate current group
        const property = await Property.findById(propertyId).populate("currentGroup");

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (!property.currentGroup) {
            return res.status(400).json({ message: "No active group for this property" });
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

        const group = property.currentGroup;

        // Check if group is open
        if (group.status !== "OPEN" && group.status !== "QUALIFIED") {
            return res.status(400).json({
                message: `Cannot join group with status: ${group.status}`
            });
        }

        // Check deadline
        if (new Date() > new Date(property.groupJoiningDeadline)) {
            return res.status(400).json({ message: "Group joining deadline has passed" });
        }

        // Check if buyer already joined
        const existingMember = await GroupMember.findOne({
            group: group._id,
            buyer: buyerId
        });

        if (existingMember) {
            return res.status(400).json({ message: "You have already joined this group" });
        }

        // Check if group has reached maximum size
        const currentMemberCount = group.members.length;
        if (currentMemberCount >= property.minimumGroupSize) {
            return res.status(400).json({
                message: "Group is already full. Maximum size reached."
            });
        }

        // Create group member (token auto-set to PAID - simulated payment)
        const member = await GroupMember.create({
            group: group._id,
            buyer: buyerId,
            tokenStatus: "PAID",
        });

        // Add member to group
        group.members.push(member._id);
        await group.save();

        // Check if group now qualifies
        await group.checkQualification();

        const populatedMember = await GroupMember.findById(member._id)
            .populate("buyer", "name email")
            .populate({
                path: "group",
                populate: {
                    path: "property",
                    populate: { path: "city" }
                }
            });

        // -------------------------
        // Disptach Automated Email
        // -------------------------
        try {
            const htmlContent = buildPropertyTokenEmail(
                populatedMember.buyer.name,
                populatedMember.group.property.projectName,
                populatedMember.group.property.tokenAmount,
                group.status
            );
            
            // Fire and forget (asynchronous)
            sendEmail({
                to: populatedMember.buyer.email,
                subject: `Token Payment Successful - ${populatedMember.group.property.projectName}`,
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
// @route   GET /api/group-members/my-groups
// @access  Private/Buyer
export const getMyGroups = async (req, res) => {
    try {
        const buyerId = req.user._id;

        const memberships = await GroupMember.find({ buyer: buyerId })
            .populate({
                path: "group",
                populate: {
                    path: "property",
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
// @route   GET /api/group-members/status/:groupId
// @access  Private/Buyer
export const getGroupStatus = async (req, res) => {
    try {
        const { groupId } = req.params;
        const buyerId = req.user._id;

        const group = await PropertyGroup.findById(groupId)
            .populate({
                path: "property",
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
        const membership = await GroupMember.findOne({
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
