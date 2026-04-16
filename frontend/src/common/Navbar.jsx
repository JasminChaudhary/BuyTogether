import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Car, ChevronDown, MapPin, User, Plus } from "lucide-react";
import CitySelectionModal from "../user/components/CitySelectionModal";
import api from "./api";

const Navbar = ({ role, links }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Dubai");
    const [showCityModal, setShowCityModal] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    // Get user info
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const city = localStorage.getItem("selectedCity");
        if (city) setSelectedCity(JSON.parse(city).name || city);

        if (token) {
            const fetchNotifications = async () => {
                try {
                    const res = await api.get("/notifications");
                    const unread = res.data.filter(n => !n.isRead).length;
                    setUnreadNotifications(unread);
                } catch (err) {
                    console.error("Failed to fetch notifications", err);
                }
            };
            fetchNotifications();
        }
    }, [token]);

    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : "U";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedCity"); // Clear selected city on logout
        navigate("/login");
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city.name);
        localStorage.setItem("selectedCity", JSON.stringify(city));
        setShowCityModal(false);
        window.location.reload(); // Reload to refresh data with new city
    };

    return (
        <nav style={styles.navbar}>
            <CitySelectionModal
                isOpen={showCityModal}
                onClose={() => setShowCityModal(false)}
                onCitySelect={handleCitySelect}
            />
            <div style={styles.container}>
                <div style={styles.leftSection}>
                    <Link to={role === "ADMIN" ? "/admin" : "/user"} style={styles.logoLink}>
                        <span style={styles.logoText}>
                            Buy<span style={{ color: "#10b981" }}>Together</span>
                        </span>
                    </Link>
                </div>

                <div style={styles.centerSection}>
                    {/* Browse Dropdown */}
                    <div
                        style={styles.browseContainer}
                        onMouseEnter={() => setShowBrowseDropdown(true)}
                        onMouseLeave={() => setShowBrowseDropdown(false)}
                    >
                        <button style={styles.browseButton}>
                            Browse
                            <ChevronDown style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
                        </button>

                        {showBrowseDropdown && (
                            <div style={styles.browseDropdown}>
                                <div style={styles.browseDropdownInner}>
                                    <Link to="/user/properties" style={styles.browseDropdownItem} onClick={() => setShowBrowseDropdown(false)}>
                                        <Building2 style={{ width: '18px', height: '18px' }} />
                                        <span>Properties</span>
                                    </Link>
                                    <Link to="/user/dealerships" style={styles.browseDropdownItem} onClick={() => setShowBrowseDropdown(false)}>
                                        <Car style={{ width: '18px', height: '18px' }} />
                                        <span>Car Dealerships</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {links.map((link) => (
                        <Link key={link.path} to={link.path} style={styles.navLink}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div style={styles.rightSection}>
                    {/* City Selector */}
                    <button onClick={() => setShowCityModal(true)} style={styles.citySelector}>
                        <MapPin style={{ width: '16px', height: '16px', color: '#10b981' }} />
                        <span>{selectedCity}</span>
                        <ChevronDown style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                    </button>

                    {/* Dashboard Link - Primary entry point for User */}
                    <Link to={role === "ADMIN" ? "/admin" : "/user/dashboard"} style={styles.dashboardLink}>
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            <User style={{ width: '18px', height: '18px' }} />
                            {unreadNotifications > 0 && (
                                <span style={styles.notificationDot}></span>
                            )}
                        </div>
                        <span>Dashboard</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0 24px",
        height: "80px", // Increased height slightly for better vertical breathing room
        display: "flex", // Keep flex on navbar for vertical centering of container
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },
    container: {
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr", // Ensures center section is perfectly centered
        alignItems: "center",
        gap: "20px", // Safety gap
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    logoLink: {
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
    },
    logoText: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#000000",
        letterSpacing: "-1px",
    },
    centerSection: {
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        alignItems: "center",
    },
    navLink: {
        textDecoration: "none",
        color: "#4b5563",
        fontWeight: "600",
        fontSize: "15px",
        transition: "color 0.2s",
        whiteSpace: "nowrap",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "16px", // Slightly tighter gap to fit content
    },
    profileContainer: {
        position: "relative",
        padding: "10px 0",
        cursor: "pointer",
    },
    profileTrigger: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "6px", // Reduced padding around avatar to align better
        borderRadius: "50px",
        transition: "background-color 0.2s",
    },
    userName: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#1f2937",
        whiteSpace: "nowrap",
    },
    avatar: {
        width: "38px", // Subtle adjust
        height: "38px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "700",
        boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)",
        transition: "transform 0.2s",
        flexShrink: 0,
    },
    dropdown: {
        position: "absolute",
        top: "100%",
        right: 0,
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        width: "220px",
        padding: "8px",
        border: "1px solid #f3f4f6",
    },
    dropdownHeader: {
        padding: "12px",
    },
    dropdownName: {
        margin: "0 0 4px 0",
        fontSize: "15px",
        fontWeight: "700",
        color: "#111827",
    },
    dropdownEmail: {
        margin: 0,
        fontSize: "12px",
        color: "#6b7280",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    dropdownDivider: {
        height: "1px",
        backgroundColor: "#f3f4f6",
        margin: "8px 0",
    },
    dropdownItem: {
        display: "block",
        padding: "10px 12px",
        textDecoration: "none",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "500",
        borderRadius: "6px",
        transition: "background-color 0.2s",
        ":hover": {
            backgroundColor: "#f3f4f6",
        }
    },
    dropdownItemDanger: {
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        backgroundColor: "transparent",
        border: "none",
        color: "#ef4444",
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
    browseContainer: {
        position: "relative",
        height: "100%", // Full height to help with hover
        display: "flex",
        alignItems: "center",
    },
    browseButton: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "none",
        border: "none",
        color: "#4b5563",
        fontWeight: "600",
        fontSize: "15px",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "6px",
        transition: "all 0.2s",
        height: "100%",
    },
    browseDropdown: {
        position: "absolute",
        top: "100%", // Position right below
        left: 0,
        marginTop: "0px", // Remove gap
        paddingTop: "10px", // Add padding to inside of dropdown container acts as bridge if needed, or use a bridge div
        backgroundColor: "transparent", // Transparent wrapper
        zIndex: 100,
    },
    // Inner dropdown card (the actual visible part)
    browseDropdownInner: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        width: "200px",
        padding: "8px",
        border: "1px solid #f3f4f6",
    },
    browseDropdownItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        textDecoration: "none",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "500",
        borderRadius: "6px",

        transition: "background-color 0.2s",
    },
    citySelector: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "transparent",
        color: "#111827",
        border: "1px solid #e5e7eb",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap", // Ensure city name doesn't break layout
    },
    dashboardLink: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        textDecoration: "none",
        color: "#111827",
        fontSize: "14px",
        fontWeight: "600",
        padding: "8px 12px",
        borderRadius: "8px",
        transition: "background-color 0.2s",
        whiteSpace: "nowrap",
    },
    startGroupButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10b981",
        color: "#ffffff",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "600",
        padding: "8px 20px", // Standardized to 8px vertical to match others
        borderRadius: "8px",
        transition: "background-color 0.2s",
        border: "none",
        whiteSpace: "nowrap",
    },
    notificationDot: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        width: '10px',
        height: '10px',
        backgroundColor: '#ef4444',
        borderRadius: '50%',
        border: '2px solid #ffffff',
        zIndex: 10
    }
};

export default Navbar;
