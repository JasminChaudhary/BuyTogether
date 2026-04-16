import React from "react";
import { Users, ShieldCheck, TrendingUp } from "lucide-react";

const CommunitySection = () => {
    return (
        <section style={styles.section}>
            {/* Background Pattern */}
            <div style={styles.backgroundPattern}>
                <div style={styles.circle1} />
                <div style={styles.circle2} />
                <div style={styles.circle3} />
            </div>

            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.heading}>Why Join Our Community?</h2>
                    <p style={styles.subtitle}>
                        Experience the power of collective buying with benefits designed for you.
                    </p>
                </div>

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <div style={styles.iconWrapper}>
                            <Users style={{ width: '32px', height: '32px', color: '#10b981' }} />
                        </div>
                        <h3 style={styles.cardTitle}>Power in Numbers</h3>
                        <p style={styles.cardText}>
                            Access institutional-grade discounts usually reserved for bulk buyers.
                            Together, we negotiate better deals than any individual can.
                        </p>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.iconWrapper}>
                            <TrendingUp style={{ width: '32px', height: '32px', color: '#10b981' }} />
                        </div>
                        <h3 style={styles.cardTitle}>Transparent Savings</h3>
                        <p style={styles.cardText}>
                            See exactly where your money goes. No hidden fees or middleman markups.
                            100% of the negotiated discount is passed directly to you.
                        </p>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.iconWrapper}>
                            <ShieldCheck style={{ width: '32px', height: '32px', color: '#10b981' }} />
                        </div>
                        <h3 style={styles.cardTitle}>Vetted & Secure</h3>
                        <p style={styles.cardText}>
                            Every property and dealership is strictly vetted. Your token amount is
                            held securely until the group target is met.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ecfdf5", // Light green background
        padding: "100px 20px",
    },
    backgroundPattern: {
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        overflow: "hidden",
    },
    circle1: {
        position: "absolute",
        top: "-100px",
        left: "-100px",
        height: "400px",
        width: "400px",
        borderRadius: "50%",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
    },
    circle2: {
        position: "absolute",
        bottom: "-150px",
        right: "-50px",
        height: "500px",
        width: "500px",
        borderRadius: "50%",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
    },
    circle3: {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "800px",
        width: "800px",
        borderRadius: "50%",
        backgroundColor: "rgba(16, 185, 129, 0.03)",
    },
    container: {
        position: "relative",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: {
        textAlign: "center",
        maxWidth: "700px",
        margin: "0 auto 60px",
    },
    heading: {
        fontSize: "36px",
        fontWeight: "800",
        color: "#064e3b",
        marginBottom: "16px",
    },
    subtitle: {
        fontSize: "18px",
        color: "#065f46",
        lineHeight: "1.6",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "32px",
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "32px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.3s ease",
        ":hover": {
            transform: "translateY(-5px)",
        }
    },
    iconWrapper: {
        width: "64px",
        height: "64px",
        backgroundColor: "#d1fae5",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "12px",
    },
    cardText: {
        fontSize: "16px",
        color: "#4b5563",
        lineHeight: "1.6",
    },
};

export default CommunitySection;
