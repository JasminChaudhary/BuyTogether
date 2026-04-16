import React, { useState } from "react";
import api from "../../common/api";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { API_BASE_URL , getImageUrl } from "../../common/config";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_mock");

const JoinGroupDialog = ({ isOpen, property, onClose, onConfirm }) => {
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    if (!isOpen || !property) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleConfirm = async () => {
        if (!agreed) {
            alert("Please agree to the group rules to continue");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/payments/create-intent", {
                // Stripe amount in cents
                amount: property.tokenAmount * 100, 
                groupId: property.currentGroup?._id || "",
                groupType: 'property'
            });
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            alert("Failed to initialize secure payment.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        setLoading(true);
        try {
            await onConfirm(paymentIntentId);
        } finally {
            setLoading(false);
            setClientSecret(""); 
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={{...styles.dialog, maxWidth: clientSecret ? "1000px" : "500px", padding: clientSecret ? "0" : "32px"}} onClick={(e) => e.stopPropagation()}>
                {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripePaymentForm 
                            clientSecret={clientSecret} 
                            onPaymentSuccess={handlePaymentSuccess} 
                            onCancel={() => setClientSecret("")}
                            orderSummary={{
                                total: property.tokenAmount,
                                items: [
                                    {
                                        name: property.projectName,
                                        subtitle: property.city?.name || 'Group Phase',
                                        quantity: 1,
                                        price: property.tokenAmount,
                                        image: property.images && property.images.length > 0 
                                            ? (property.images[0].startsWith('http') ? property.images[0] : getImageUrl(property.images[0]))
                                            : null
                                    }
                                ]
                            }} 
                        />
                    </Elements>
                ) : (
                    <>
                        <h2 style={styles.title}>Join Group Buying</h2>
                        <p style={styles.subtitle}>{property.projectName}</p>
        
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Token Amount</h3>
                            <div style={styles.amountBox}>
                                <span style={styles.amount}>{formatCurrency(property.tokenAmount)}</span>
                                <span style={styles.amountLabel}>Platform Service Fee</span>
                            </div>
                        </div>
        
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Refund Policy</h3>
                            <div style={styles.policyBox}>
                                <div style={styles.policyItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    <span>Full refund if group doesn't reach minimum size</span>
                                </div>
                                <div style={styles.policyItem}>
                                    <span style={styles.checkmark}>✓</span>
                                    <span>Full refund if admin dissolves the group</span>
                                </div>
                                <div style={styles.policyItem}>
                                    <span style={styles.crossmark}>✗</span>
                                    <span>Non-refundable if deal is successful</span>
                                </div>
                            </div>
                        </div>
        
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Group Rules</h3>
                            <div style={styles.rulesBox}>
                                <p style={styles.rulesText}>{property.groupRules}</p>
                            </div>
                        </div>
        
                        <div style={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                style={styles.checkbox}
                            />
                            <label htmlFor="agree" style={styles.checkboxLabel}>
                                I agree to the group rules and refund policy
                            </label>
                        </div>
        
                        <div style={styles.actions}>
                            <button onClick={onClose} style={styles.cancelBtn} disabled={loading}>
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    ...styles.confirmBtn,
                                    opacity: !agreed || loading ? 0.5 : 1,
                                    cursor: !agreed || loading ? "not-allowed" : "pointer",
                                }}
                                disabled={!agreed || loading}
                            >
                                {loading ? "Initializing Secure Payment..." : "Confirm & Pay"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
    },
    dialog: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "500px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1f2937",
        margin: "0 0 8px 0",
    },
    subtitle: {
        fontSize: "16px",
        color: "#6b7280",
        margin: "0 0 24px 0",
    },
    section: {
        marginBottom: "24px",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#374151",
        marginBottom: "12px",
    },
    amountBox: {
        backgroundColor: "#dbeafe",
        border: "2px solid #3b82f6",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
    },
    amount: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#1e40af",
        display: "block",
    },
    amountLabel: {
        fontSize: "14px",
        color: "#3b82f6",
        marginTop: "4px",
        display: "block",
    },
    policyBox: {
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        padding: "16px",
    },
    policyItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
        fontSize: "14px",
        color: "#374151",
    },
    checkmark: {
        color: "#10b981",
        fontSize: "18px",
        fontWeight: "700",
    },
    crossmark: {
        color: "#ef4444",
        fontSize: "18px",
        fontWeight: "700",
    },
    rulesBox: {
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        padding: "16px",
    },
    rulesText: {
        fontSize: "14px",
        color: "#374151",
        lineHeight: "1.6",
        margin: 0,
    },
    checkboxContainer: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        padding: "16px",
        backgroundColor: "#fef3c7",
        borderRadius: "8px",
    },
    checkbox: {
        width: "20px",
        height: "20px",
        cursor: "pointer",
    },
    checkboxLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#92400e",
        cursor: "pointer",
    },
    actions: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
    },
    cancelBtn: {
        backgroundColor: "#e5e7eb",
        color: "#374151",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    confirmBtn: {
        backgroundColor: "#10b981",
        color: "#ffffff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
};

export default JoinGroupDialog;
