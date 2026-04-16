import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={styles.layout}>
            {/* Mobile Header */}
            <div style={styles.mobileHeader} className="md:hidden">
                <button onClick={() => setSidebarOpen(true)} style={styles.menuBtn}>
                    <Menu size={24} />
                </button>
                <span style={styles.brand}>BuyTogether Admin</span>
            </div>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};

const styles = {
    layout: {
        minHeight: "100vh",
        backgroundColor: "#f3f4f6", // Light gray background for content area
        display: "flex",
        flexDirection: "row", // Changed to row for sidebar layout
    },
    main: {
        flex: 1,
        width: "100%",
        padding: "30px 40px",
        overflowY: "auto",
        height: "100vh", // Scrollable content area
    },
    mobileHeader: {
        display: "none", // Hidden by default, shown via CSS class on mobile
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        gap: "16px",
    },
    menuBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#374151",
    },
    brand: {
        fontWeight: "700",
        fontSize: "18px",
        color: "#111827",
    },
};

export default AdminLayout;
