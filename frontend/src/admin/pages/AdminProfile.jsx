import React, { useState, useEffect } from "react";
import api from "../../common/api";
import { API_BASE_URL , getImageUrl } from "../../common/config";

const AdminProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalDealerships: 0,
        totalGroups: 0,
        activeCities: 0,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch Admin Profile from API
                const profileResponse = await api.get("/user/profile");
                const userData = profileResponse.data;

                // Update localStorage with fresh data
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);

                // Fetch Admin Stats
                try {
                    const [propertiesRes, dealershipsRes, groupsRes, citiesRes] = await Promise.all([
                        api.get("/properties"),
                        api.get("/dealerships"),
                        api.get("/property-groups"),
                        api.get("/cities"),
                    ]);

                    setStats({
                        totalProperties: propertiesRes.data?.length || 0,
                        totalDealerships: dealershipsRes.data?.length || 0,
                        totalGroups: groupsRes.data?.length || 0,
                        activeCities: citiesRes.data?.filter(c => c.isActive)?.length || 0,
                    });
                } catch (statsErr) {
                    console.error("Error loading stats:", statsErr);
                }

            } catch (err) {
                console.error("Error loading profile:", err);
                // Fallback to localStorage if API fails
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (storedUser && storedUser.name) {
                    setUser(storedUser);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div style={styles.loading}>Loading profile...</div>;
    }

    if (!user) {
        return <div style={styles.error}>User not found. Please log in.</div>;
    }

    // Get Initials
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : "A";

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            await api.post("/user/profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Refresh profile
            const response = await api.get("/user/profile");

            // Update local storage
            const updatedUser = { ...user, profilePicture: response.data.profilePicture };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Force reload to update Navbar
            window.location.reload();

        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload image.");
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.headerCard}>
                <div style={styles.avatarContainer}>
                    {user.profilePicture ? (
                        <img
                            src={getImageUrl(user.profilePicture)}
                            alt="Profile"
                            style={styles.avatarImage}
                        />
                    ) : (
                        <div style={styles.avatarLarge}>
                            {initials}
                        </div>
                    )}
                    <label htmlFor="file-upload" style={styles.editAvatarBtn}>
                        📷
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />
                </div>
                <h1 style={styles.userName}>{user.name}</h1>
                <p style={styles.userRole}>
                    <span style={styles.roleIcon}>🛡️</span>
                    {user.role}
                </p>
                <div style={styles.joinDate}>Administrator since {new Date(user.createdAt).getFullYear()}</div>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalGroups}</div>
                    <div style={styles.statLabel}>Total Groups</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalProperties}</div>
                    <div style={styles.statLabel}>Properties</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalDealerships}</div>
                    <div style={styles.statLabel}>Dealerships</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.activeCities}</div>
                    <div style={styles.statLabel}>Active Cities</div>
                </div>
            </div>

            {/* Details Section */}
            <div style={styles.detailsCard}>
                <h2 style={styles.sectionTitle}>Administrator Details</h2>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input
                        type="text"
                        value={user.name}
                        disabled
                        style={styles.inputDisabled}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        style={styles.inputDisabled}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                        type="text"
                        value={user.phone || "Not provided"}
                        disabled
                        style={styles.inputDisabled}
                    />
                </div>

                <div style={styles.divider}></div>

                <button style={styles.logoutBtn} onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    loading: {
        textAlign: "center",
        padding: "40px",
        color: "#6b7280",
    },
    error: {
        textAlign: "center",
        color: "#ef4444",
        padding: "40px",
    },
    headerCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        backgroundImage: "linear-gradient(to bottom right, #fef3c7, #fef9e7)",
    },
    avatarContainer: {
        position: "relative",
        marginBottom: "20px",
    },
    avatarImage: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.4)",
        border: "4px solid #ffffff",
    },
    editAvatarBtn: {
        position: "absolute",
        bottom: "0",
        right: "0",
        backgroundColor: "#ffffff",
        borderRadius: "50%",
        padding: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        fontSize: "16px",
        border: "1px solid #e5e7eb",
        transition: "transform 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
    },
    avatarLarge: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        backgroundColor: "#f59e0b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        fontWeight: "700",
        boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.4)",
        border: "4px solid #ffffff",
    },
    userName: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#111827",
        margin: "0 0 8px 0",
    },
    userRole: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#92400e",
        textTransform: "uppercase",
        letterSpacing: "1px",
        backgroundColor: "#fef3c7",
        padding: "4px 12px",
        borderRadius: "20px",
        margin: "0 0 16px 0",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    roleIcon: {
        fontSize: "16px",
    },
    joinDate: {
        fontSize: "14px",
        color: "#9ca3af",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
    },
    statCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        textAlign: "center",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        cursor: "default",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#f59e0b",
        marginBottom: "4px",
    },
    statLabel: {
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: "500",
    },
    detailsCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "24px",
    },
    formGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#4b5563",
        marginBottom: "8px",
    },
    inputDisabled: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        color: "#1f2937",
        fontSize: "15px",
        outline: "none",
        cursor: "not-allowed",
    },
    divider: {
        height: "1px",
        backgroundColor: "#e5e7eb",
        margin: "32px 0",
    },
    logoutBtn: {
        width: "100%",
        padding: "14px",
        backgroundColor: "#fee2e2",
        color: "#ef4444",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
};

export default AdminProfile;
