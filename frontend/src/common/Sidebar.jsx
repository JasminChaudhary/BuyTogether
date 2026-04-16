import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, MapPin, Car, Building2, Users, Settings, User, LogOut, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { label: "Manage Cities", path: "/admin/cities", icon: <MapPin size={20} /> },
        { label: "Manage Dealerships", path: "/admin/dealerships", icon: <Car size={20} /> },
        { label: "Manage Properties", path: "/admin/properties", icon: <Building2 size={20} /> },
        { label: "Manage Groups", path: "/admin/groups", icon: <Users size={20} /> },
    ];

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedCity");
        navigate("/login");
    };

    return (
        <aside style={{
            ...styles.sidebar,
            transform: isOpen ? "translateX(0)" : "translateX(0)", // Always visible on desktop for now, responsiveness can be added if needed
        }}>
            <div style={styles.header}>
                <h2 style={styles.logo}>BuyTogether Admin</h2>
                <button onClick={onClose} style={styles.closeBtn} className="md:hidden">
                    <X size={24} />
                </button>
            </div>

            <nav style={styles.nav}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            ...styles.link,
                            ...(isActive(item.path) ? styles.activeLink : {}),
                        }}
                    >
                        <span style={isActive(item.path) ? styles.iconActive : styles.icon}>
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div style={styles.footer}>
                <Link
                    to="/admin/settings"
                    style={{
                        ...styles.link,
                        ...(isActive("/admin/settings") ? styles.activeLink : {}),
                    }}
                >
                    <span style={isActive("/admin/settings") ? styles.iconActive : styles.icon}>
                        <Settings size={20} />
                    </span>
                    Settings
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <span style={styles.icon}>
                        <LogOut size={20} />
                    </span>
                    Logout
                </button>
            </div>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: "280px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 50,
        transition: "transform 0.3s ease-in-out",
    },
    header: {
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f3f4f6", // Optional, maybe clean without it like the screenshot
    },
    logo: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
        margin: 0,
    },
    nav: {
        flex: 1,
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    link: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        textDecoration: "none",
        color: "#4b5563",
        fontSize: "15px",
        fontWeight: "500",
        borderRadius: "8px",
        transition: "all 0.2s",
        border: "1px solid transparent",
    },
    activeLink: {
        backgroundColor: "#059669", // Darker green like screenshot
        color: "#ffffff",
        fontWeight: "600",
        boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.2)",
    },
    icon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "inherit",
    },
    iconActive: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
    },
    footer: {
        padding: "24px 16px",
        borderTop: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        backgroundColor: "transparent",
        border: "none",
        color: "#4b5563",
        fontSize: "15px",
        fontWeight: "500",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
        width: "100%",
        textAlign: "left",
    },
    closeBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#6b7280",
    },
};

export default Sidebar;
