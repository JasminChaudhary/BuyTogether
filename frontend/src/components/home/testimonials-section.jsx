import React from "react";
import { Link } from "react-router-dom";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Property Buyer",
    content: "Joining a buying group through BuyTogether saved me ₹18 Lakhs on my dream apartment in Bangalore. The process was transparent and secure. Highly recommended!",
    avatar: null,
    savings: 1800000,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Car Buyer",
    content: "I never thought buying a luxury car could be this affordable. The group discount was incredible, and I still own 100% of my vehicle!",
    avatar: null,
    savings: 450000,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Property Investor",
    content: "BuyTogether made property investment accessible. The collective bargaining power is real, and the platform is trustworthy and professional.",
    avatar: null,
    savings: 2500000,
  },
];

const TestimonialsSection = () => {
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)}Cr`;
    }
    if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}L`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>
            Success Stories
          </h2>
          <p style={styles.subtitle}>
            Hear from buyers who saved big with BuyTogether
          </p>
        </div>

        <div style={styles.testimonialsGrid}>
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} style={styles.card}>
              <div style={styles.cardContent}>
                <Quote style={styles.quoteIcon} />
                <p style={styles.testimonialText}>{testimonial.content}</p>
                <div style={styles.authorSection}>
                  <div style={styles.avatar}>
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <span style={styles.avatarInitial}>
                        {testimonial.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p style={styles.authorName}>{testimonial.name}</p>
                    <p style={styles.authorRole}>{testimonial.role}</p>
                  </div>
                </div>
                <div style={styles.footer}>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} style={styles.starIcon} />
                    ))}
                  </div>
                  <span style={styles.savings}>
                    Saved ₹ {formatPrice(testimonial.savings)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: "#ffffff",
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
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.3s",
  },
  cardContent: {
    padding: "24px",
  },
  quoteIcon: {
    width: "32px",
    height: "32px",
    color: "rgba(16, 185, 129, 0.2)",
    marginBottom: "16px",
  },
  testimonialText: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#6b7280",
    marginBottom: "24px",
  },
  authorSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#10b981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarInitial: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "600",
  },
  authorName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  authorRole: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "16px",
  },
  stars: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  starIcon: {
    width: "16px",
    height: "16px",
    fill: "#10b981",
    color: "#10b981",
  },
  savings: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#10b981",
  },
};

export default TestimonialsSection;
