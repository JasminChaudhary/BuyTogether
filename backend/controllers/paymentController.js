import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

// @desc    Create a payment intent
// @route   POST /api/payments/create-intent
// @access  Private/Buyer
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, groupId, groupType } = req.body;
        
        // We ensure a minimum amount just to test Stripe (e.g. $500 token)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount || 50000, // $500 in cents
            currency: currency || "usd",
            metadata: {
                buyerId: req.user._id.toString(),
                groupId: groupId,
                groupType: groupType // 'property' or 'dealership'
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: "Failed to create payment intent", error: error.message });
    }
};
