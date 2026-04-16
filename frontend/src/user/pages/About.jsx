import React from "react";
import { Shield, TrendingUp, Users } from "lucide-react";

const About = () => {
    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <h1 style={styles.title}>Democratizing Real Estate & Auto Ownership</h1>
                <p style={styles.subtitle}>
                    We believe that premium assets shouldn't be reserved for the ultra-wealthy.
                    By pooling demand, we empower individuals to negotiate like institutions.
                </p>
            </div>

            {/* Mission Section */}
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={styles.iconBox}>
                        <Users size={32} color="#059669" />
                    </div>
                    <h3 style={styles.cardTitle}>Community-Driven</h3>
                    <p style={styles.cardText}>
                        Our platform is built on the power of community. When we come together,
                        we unlock value that is impossible to achieve alone.
                    </p>
                </div>
                <div style={styles.card}>
                    <div style={styles.iconBox}>
                        <TrendingUp size={32} color="#059669" />
                    </div>
                    <h3 style={styles.cardTitle}>Transparency First</h3>
                    <p style={styles.cardText}>
                        No hidden fees, no opaque negotiations. You see exactly what the discount is,
                        how many people are needed, and where your money goes.
                    </p>
                </div>
                <div style={styles.card}>
                    <div style={styles.iconBox}>
                        <Shield size={32} color="#059669" />
                    </div>
                    <h3 style={styles.cardTitle}>Verified & Secure</h3>
                    <p style={styles.cardText}>
                        Ensure peace of mind with vetted developers, authorized dealerships, and
                        secure payment processing for all token amounts.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div style={styles.statsSection}>
                <div style={styles.statItem}>
                    <div style={styles.statValue}>100+</div>
                    <div style={styles.statLabel}>Partnered Developers</div>
                </div>
                <div style={styles.statDivider}></div>
                <div style={styles.statItem}>
                    <div style={styles.statValue}>$45M</div>
                    <div style={styles.statLabel}>Total Savings Unlocked</div>
                </div>
                <div style={styles.statDivider}></div>
                <div style={styles.statItem}>
                    <div style={styles.statValue}>15k+</div>
                    <div style={styles.statLabel}>Happy Buyers</div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 24px",
    },
    hero: {
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto 80px auto",
    },
    title: {
        fontSize: "48px",
        fontWeight: "800",
        color: "#111827",
        marginBottom: "24px",
        lineHeight: "1.2",
    },
    subtitle: {
        fontSize: "20px",
        color: "#4b5563",
        lineHeight: "1.6",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "32px",
        marginBottom: "80px",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "40px 32px",
        borderRadius: "24px",
        border: "1px solid #f3f4f6",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.2s",
        ':hover': {
            transform: "translateY(-4px)",
        }
    },
    iconBox: {
        width: "60px",
        height: "60px",
        backgroundColor: "#ecfdf5",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
    },
    cardTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "16px",
    },
    cardText: {
        fontSize: "16px",
        color: "#6b7280",
        lineHeight: "1.6",
    },
    statsSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
        borderRadius: "24px",
        padding: "60px",
        flexWrap: "wrap",
        gap: "40px",
        color: "white",
    },
    statItem: {
        textAlign: "center",
        minWidth: "150px",
    },
    statValue: {
        fontSize: "48px",
        fontWeight: "800",
        color: "#10b981",
        marginBottom: "8px",
    },
    statLabel: {
        fontSize: "16px",
        color: "#d1d5db",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    statDivider: {
        width: "1px",
        height: "60px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        display: "none", // Hide on mobile, show on larger screens via media queries
    },
};

export default About;
