import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.ctaBox}>
          {/* Background Pattern */}
          <div style={styles.backgroundPattern}>
            <div style={styles.circle1} />
            <div style={styles.circle2} />
          </div>

          <div style={styles.content}>
            <div style={styles.iconCircle}>
              <Users style={{ width: '32px', height: '32px', color: '#ffffff' }} />
            </div>
            <h2 style={styles.heading}>
              Ready to Start Saving?
            </h2>
            <p style={styles.subtitle}>
              Join thousands of smart buyers who are getting better deals through collective bargaining power.
            </p>
            <div style={styles.buttons}>
              <Link to="/user/my-groups" style={styles.primaryButton}>
                <span>Browse Groups</span>
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </Link>
              <Link to="/user/properties" style={styles.secondaryButton}>
                Create a Group
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "80px 20px",
    backgroundColor: "#ffffff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  ctaBox: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "24px",
    backgroundColor: "#10b981",
    padding: "60px 24px",
    textAlign: "center",
  },
  backgroundPattern: {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    right: "-80px",
    top: "-80px",
    height: "300px",
    width: "300px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  circle2: {
    position: "absolute",
    bottom: "-40px",
    left: "-40px",
    height: "200px",
    width: "200px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  content: {
    position: "relative",
    maxWidth: "700px",
    margin: "0 auto",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    margin: "0 auto 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "32px",
  },
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    color: "#10b981",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    color: "#ffffff",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.2s",
  },
};

export default CTASection;
