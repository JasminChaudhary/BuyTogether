import React from "react";
import { Link } from "react-router-dom";
import { Search, Users, FileCheck, Key, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Asset",
    description: "Browse our curated listings of properties and cars from trusted developers and dealers."
  },
  {
    icon: Users,
    title: "Join a Group",
    description: "Find an existing buying group or create your own. Connect with other buyers interested in the same asset."
  },
  {
    icon: FileCheck,
    title: "Confirm & Pay",
    description: "Once the group reaches its target, confirm your purchase. Secure escrow protects your payment."
  },
  {
    icon: Key,
    title: "Own 100%",
    description: "Complete the purchase and receive full individual ownership of your property or car."
  }
];

const HowItWorksSection = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>
            How BuyTogether Works
          </h2>
          <p style={styles.subtitle}>
            A simple 4-step process to save thousands on your next big purchase
          </p>
        </div>

        <div style={styles.stepsGrid}>
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} style={styles.stepWrapper}>
                {index < steps.length - 1 && (
                  <div style={styles.connector} />
                )}
                <div style={styles.stepCard}>
                  <div style={styles.iconCircle}>
                    <IconComponent style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div style={styles.stepNumber}>Step {index + 1}</div>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.ctaContainer}>
          <Link to="/user/how-it-works" style={styles.learnMoreButton}>
            <span>Learn More</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: "#f9fafb",
    padding: "80px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    maxWidth: "700px",
    margin: "0 auto 48px",
    textAlign: "center",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#6b7280",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  stepWrapper: {
    position: "relative",
  },
  connector: {
    position: "absolute",
    right: 0,
    top: "48px",
    height: "2px",
    width: "100%",
    backgroundColor: "#e5e7eb",
    transform: "translateX(50%)",
    display: "none", // Hidden on mobile, can be shown on desktop with media queries
  },
  stepCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    transition: "all 0.3s",
  },
  iconCircle: {
    width: "48px",
    height: "48px",
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    color: "#ffffff",
  },
  stepNumber: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#10b981",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stepTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  stepDescription: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#6b7280",
    margin: 0,
  },
  ctaContainer: {
    marginTop: "48px",
    textAlign: "center",
  },
  learnMoreButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};

export default HowItWorksSection;
