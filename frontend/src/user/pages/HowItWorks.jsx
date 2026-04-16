import React from "react";
import { CheckCircle, Users, TrendingUp, Handshake, Search, ArrowRight } from "lucide-react";

const HowItWorks = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>How BuyTogether Works</h1>
                <p style={styles.subtitle}>
                    Join forces with other buyers to unlock exclusive bulk discounts on properties and cars.
                </p>
            </div>

            <div style={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <div key={index} style={styles.stepCard}>
                        <div style={styles.iconWrapper}>
                            {step.icon}
                        </div>
                        <h3 style={styles.stepTitle}>{step.title}</h3>
                        <p style={styles.stepDescription}>{step.description}</p>
                        {index < steps.length - 1 && (
                            <div style={styles.arrow}>
                                <ArrowRight size={24} color="#d1d5db" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={styles.faqSection}>
                <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
                <div style={styles.faqGrid}>
                    {faqs.map((faq, index) => (
                        <div key={index} style={styles.faqCard}>
                            <h4 style={styles.question}>{faq.question}</h4>
                            <p style={styles.answer}>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const steps = [
    {
        icon: <Search size={32} color="#059669" />,
        title: "1. Browse Deals",
        description: "Explore exclusive properties and car deals available for group buying."
    },
    {
        icon: <Users size={32} color="#059669" />,
        title: "2. Join a Group",
        description: "Commit to a purchase by paying a small token amount to join the group."
    },
    {
        icon: <TrendingUp size={32} color="#059669" />,
        title: "3. Unlock Discounts",
        description: "Once the group reaches the target size, the bulk discount is unlocked."
    },
    {
        icon: <Handshake size={32} color="#059669" />,
        title: "4. Complete Purchase",
        description: "Connect directly with the seller to finalize your purchase at the discounted rate."
    }
];

const faqs = [
    {
        question: "Is my token amount refundable?",
        answer: "Yes, if the group fails to form or the deal is cancelled, your token amount is fully refunded."
    },
    {
        question: "Do I own the property individually?",
        answer: "Absolutely. You get 100% individual ownership. The group is only for negotiating the discount."
    },
    {
        question: "Are the developers/dealers verified?",
        answer: "Yes, we vet every seller on our platform to ensure safety and authenticity."
    },
    {
        question: "Can I exit a group?",
        answer: "You can exit before the group is finalized. Refunds depend on the specific deal terms."
    }
];

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 24px",
    },
    header: {
        textAlign: "center",
        marginBottom: "60px",
    },
    title: {
        fontSize: "42px",
        fontWeight: "800",
        color: "#111827",
        marginBottom: "16px",
    },
    subtitle: {
        fontSize: "20px",
        color: "#6b7280",
        maxWidth: "600px",
        margin: "0 auto",
    },
    stepsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        marginBottom: "80px",
        position: "relative",
    },
    stepCard: {
        backgroundColor: "#ffffff",
        padding: "32px",
        borderRadius: "20px",
        border: "1px solid #e5e7eb",
        textAlign: "center",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        position: "relative",
        zIndex: 1,
    },
    iconWrapper: {
        width: "64px",
        height: "64px",
        backgroundColor: "#ecfdf5",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px auto",
    },
    stepTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "12px",
    },
    stepDescription: {
        fontSize: "16px",
        color: "#6b7280",
        lineHeight: "1.6",
    },
    arrow: {
        position: "absolute",
        top: "50%",
        right: "-20px",
        transform: "translateY(-50%)",
        display: "none", // Hide by default, show on large screens if desired with media queries (complex in inline styles)
    },
    faqSection: {
        backgroundColor: "#f9fafb",
        padding: "60px",
        borderRadius: "24px",
    },
    faqTitle: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        marginBottom: "40px",
    },
    faqGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "32px",
    },
    faqCard: {
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
    },
    question: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "12px",
    },
    answer: {
        fontSize: "16px",
        color: "#6b7280",
        lineHeight: "1.6",
    },
};

export default HowItWorks;
