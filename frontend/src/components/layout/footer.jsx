import React from "react";
import { Link } from "react-router-dom";
import { Users, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand */}
          <div style={styles.column}>
            <Link to="/" style={styles.brandLink}>
              <div style={styles.logoIcon}>
                <Users style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              </div>
              <span style={styles.brandName}>BuyTogether</span>
            </Link>
            <p style={styles.brandDescription}>
              Own 100%, Save Together. Join buying groups to purchase properties and cars at
              exclusive bulk discounts.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>
                <Facebook style={{ width: '20px', height: '20px' }} />
              </a>
              <a href="#" style={styles.socialLink}>
                <Twitter style={{ width: '20px', height: '20px' }} />
              </a>
              <a href="#" style={styles.socialLink}>
                <Instagram style={{ width: '20px', height: '20px' }} />
              </a>
              <a href="#" style={styles.socialLink}>
                <Linkedin style={{ width: '20px', height: '20px' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/user/properties" style={styles.link}>
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/user/dealerships" style={styles.link}>
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/user/my-groups" style={styles.link}>
                  Active Groups
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" style={styles.link}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" style={styles.link}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Support</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/how-it-works#faq" style={styles.link}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" style={styles.link}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={styles.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={styles.link}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" style={styles.link}>
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Contact Us</h4>
            <ul style={styles.contactList}>
              <li style={styles.contactItem}>
                <MapPin style={{ width: '16px', height: '16px' }} />
                <span>Downtown Dubai, UAE</span>
              </li>
              <li style={styles.contactItem}>
                <Phone style={{ width: '16px', height: '16px' }} />
                <span>+971 4 123 4567</span>
              </li>
              <li style={styles.contactItem}>
                <Mail style={{ width: '16px', height: '16px' }} />
                <span>hello@buytogether.ae</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.bottomContent}>
            <p style={styles.copyright}>2024 BuyTogether. All rights reserved.</p>
            <p style={styles.license}>Licensed and regulated in the UAE</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "48px 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "32px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
  },
  logoIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "#10b981",
  },
  brandName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  brandDescription: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#6b7280",
    margin: 0,
  },
  socialLinks: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  socialLink: {
    color: "#6b7280",
    transition: "color 0.2s",
    textDecoration: "none",
  },
  columnTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  link: {
    fontSize: "14px",
    color: "#6b7280",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  contactList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#6b7280",
  },
  bottom: {
    marginTop: "48px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "24px",
  },
  bottomContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },
  copyright: {
    margin: 0,
  },
  license: {
    margin: 0,
  },
};

export default Footer;
