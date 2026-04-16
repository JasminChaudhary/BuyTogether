import React from "react";
import { Link } from "react-router-dom";
import { Home, Car, Shield, TrendingUp, CheckCircle } from "lucide-react";

const HeroSection = () => {
  // Mock stats data
  const stats = {
    totalUsers: 15600,
    totalSavings: 45000000,
    propertiesSold: 89,
    carsSold: 124
  };

  const formatNumber = (num) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}Cr`;
    }
    if (num >= 100000) {
      return `${(num / 100000).toFixed(1)}L`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <section style={styles.section}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}>
        <div style={styles.circle1} />
        <div style={styles.circle2} />
      </div>

      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.badge}>
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            <span>Trusted by {formatNumber(stats.totalUsers)}+ buyers</span>
          </div>

          <h1 style={styles.heading}>
            Own 100%,{" "}
            <span style={styles.headingAccent}>Save Together</span>
          </h1>

          <p style={styles.subtitle}>
            Join buying groups to purchase properties and cars at exclusive bulk discounts.
            Full individual ownership with collective savings power.
          </p>

          <div style={styles.ctaButtons}>
            <Link to="/user/properties" style={styles.primaryButton}>
              <Home style={{ width: '18px', height: '18px' }} />
              <span>Browse Properties</span>
            </Link>
            <Link to="/user/dealerships" style={styles.secondaryButton}>
              <Car style={{ width: '18px', height: '18px' }} />
              <span>Browse Cars</span>
            </Link>
          </div>

          <div style={styles.trustIndicators}>
            <div style={styles.indicator}>
              <Shield style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <span>Secure Payments</span>
            </div>
            <div style={styles.indicator}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <span>Verified Discounts</span>
            </div>
            <div style={styles.indicator}>
              <Home style={{ width: '20px', height: '20px', color: '#10b981' }} />
              <span>100% Ownership</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{formatNumber(stats.totalUsers)}</p>
            <p style={styles.statLabel}>Active Buyers</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>₹ {formatNumber(stats.totalSavings)}</p>
            <p style={styles.statLabel}>Total Savings</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{stats.propertiesSold}</p>
            <p style={styles.statLabel}>Properties Sold</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{stats.carsSold}</p>
            <p style={styles.statLabel}>Cars Sold</p>
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
    backgroundColor: "#f9fafb",
    paddingTop: "80px",
    paddingBottom: "80px",
  },
  backgroundPattern: {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    right: "-160px",
    top: "-160px",
    height: "500px",
    width: "500px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.05)",
  },
  circle2: {
    position: "absolute",
    bottom: "-80px",
    left: "-80px",
    height: "400px",
    width: "400px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.05)",
  },
  container: {
    position: "relative",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    padding: "8px 16px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "24px",
    border: "1px solid #bbf7d0",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "800",
    lineHeight: "1.2",
    color: "#111827",
    marginBottom: "24px",
  },
  headingAccent: {
    color: "#10b981",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#6b7280",
    maxWidth: "700px",
    margin: "0 auto 32px",
  },
  ctaButtons: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "48px",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s",
    border: "none",
    cursor: "pointer",
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },
  trustIndicators: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px",
    fontSize: "14px",
    color: "#6b7280",
  },
  indicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    maxWidth: "900px",
    margin: "64px auto 0",
  },
  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
};

export default HeroSection;
