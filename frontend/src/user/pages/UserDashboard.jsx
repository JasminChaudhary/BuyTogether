import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";
import MyGroups from './MyGroups';
import UserProfile from './UserProfile';
import { Bell, Heart, Users, Settings, Plus, TrendingUp, MapPin, Building, Car, X } from "lucide-react";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("groups");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [notifications, setNotifications] = useState([]);
    const [savedProperties, setSavedProperties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({
        activeGroups: 0,
        savedItems: 0,
        notifications: 0,
        potentialSavings: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [groupsRes, notificationsRes, savedRes] = await Promise.all([
                    api.get("/group-members/my-groups"),
                    api.get("/notifications"),
                    api.get("/user/saved-properties")
                ]);

                const active = groupsRes.data.filter(g => g.group?.status !== "DISSOLVED" && g.group?.status !== "SUCCESSFUL");

                // Calculate savings using minimumPrice and 10%
                const calculatedSavings = active.reduce((acc, curr) => {
                    const priceToUse = curr.group?.property?.minimumPrice || curr.group?.property?.price || 0;
                    return acc + (priceToUse * 0.1);
                }, 0);

                setNotifications(notificationsRes.data || []);
                const unreadCount = notificationsRes.data?.filter(n => !n.isRead).length || 0;
                
                const fetchedSavedParams = savedRes.data || [];
                setSavedProperties(fetchedSavedParams);

                setStats({
                    activeGroups: active.length,
                    savedItems: fetchedSavedParams.length,
                    notifications: unreadCount,
                    potentialSavings: calculatedSavings
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };

        fetchStats();
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await api.put(`/notifications/${notification._id}/read`);
                setNotifications(prev => prev.filter(n => n._id !== notification._id));
                setStats(prev => ({ ...prev, notifications: Math.max(0, prev.notifications - 1) }));
            } catch (err) {
                console.error("Failed to mark notification as read", err);
            }
        }

        // Navigate based on type
        if (notification.type === 'PROPERTY_GROUP_MESSAGE' || notification.type === 'GROUP_MESSAGE') {
            navigate(`/user/groups/${notification.relatedId}/chat`);
        } else if (notification.type === 'DEALERSHIP_GROUP_MESSAGE') {
            navigate(`/user/dealership-groups/${notification.relatedId}/chat`);
        } else if (notification.type === 'NEW_PROPERTY') {
            navigate(`/user/properties/${notification.relatedId}`);
        } else if (notification.type === 'NEW_DEALERSHIP') {
            navigate(`/user/dealerships/${notification.relatedId}`);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setStats(prev => ({ ...prev, notifications: 0 }));
        } catch (err) {
            console.error("Failed to mark all notifications as read", err);
        }
    };

    const handleUnsave = async (propertyId) => {
        try {
            await api.post(`/user/saved-properties/${propertyId}`);
            setSavedProperties(prev => prev.filter(p => p._id !== propertyId));
            setStats(prev => ({ ...prev, savedItems: Math.max(0, prev.savedItems - 1) }));
        } catch (err) {
            console.error("Failed to unsave property", err);
        }
    };

    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : "U";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                {/* Top Header */}
                <div style={styles.header}>
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user.profilePicture ? (
                                <img
                                    src={`http://localhost:5000/${user.profilePicture}`}
                                    alt="Profile"
                                    style={styles.avatarImg}
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <div>
                            <h1 style={styles.greeting}>Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
                            <p style={styles.userSince}>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)} style={styles.createBtn}>
                        <Plus size={20} />
                        Start New Group
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconBox, backgroundColor: "#eff6ff", color: "#2563eb" }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Active Groups</div>
                            <div style={styles.statValue}>{stats.activeGroups}</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconBox, backgroundColor: "#ecfdf5", color: "#059669" }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Potential Savings</div>
                            <div style={{ ...styles.statValue, color: "#059669" }}>{formatCurrency(stats.potentialSavings)}</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconBox, backgroundColor: "#fef2f2", color: "#dc2626" }}>
                            <Heart size={24} />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Saved Properties</div>
                            <div style={styles.statValue}>{stats.savedItems}</div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.iconBox, backgroundColor: "#fff7ed", color: "#ea580c" }}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <div style={styles.statLabel}>Notifications</div>
                            <div style={styles.statValue}>{stats.notifications}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div style={styles.tabsContainer}>
                    {[
                        { id: "groups", label: "My Groups", icon: <Users size={18} /> },
                        { id: "saved", label: "Saved", icon: <Heart size={18} /> },
                        { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
                        { id: "settings", label: "Settings", icon: <Settings size={18} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tab,
                                ...(activeTab === tab.id ? styles.activeTab : {}),
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {tab.icon}
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={styles.contentArea}>
                    {activeTab === "groups" && (
                        <div>
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.contentTitle}>Active Buying Groups</h2>
                                <button onClick={() => navigate("/user/properties")} style={styles.linkBtn}>Browse All Properties</button>
                            </div>
                            <MyGroups embedded={true} />
                        </div>
                    )}
                    {activeTab === "saved" && (
                        <div>
                            {savedProperties.length === 0 ? (
                                <div style={styles.placeholder}>
                                    <Heart size={48} strokeWidth={1.5} />
                                    <h3 style={styles.placeholderTitle}>No Saved Items</h3>
                                    <p style={styles.placeholderText}>Properties you mark as favorite will appear here.</p>
                                    <button onClick={() => navigate("/user/properties")} style={styles.secondaryBtn}>Browse Properties</button>
                                </div>
                            ) : (
                                <div>
                                    <div style={styles.sectionHeader}>
                                        <h2 style={styles.contentTitle}>Saved Properties</h2>
                                    </div>
                                    <div style={styles.savedGrid}>
                                        {savedProperties.map((property) => {
                                            const imageUrl = property.images && property.images.length > 0
                                                ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5000/${property.images[0].replace(/\\/g, '/')}`)
                                                : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                                                
                                            return (
                                                <div key={property._id} style={styles.savedCard}>
                                                    <div style={styles.savedCardImgBox}>
                                                        <img src={imageUrl} alt={property.projectName} style={styles.savedCardImg} />
                                                        <button 
                                                            style={styles.heartBtn}
                                                            onClick={(e) => { e.stopPropagation(); handleUnsave(property._id); }}
                                                            title="Remove from saved"
                                                        >
                                                            <Heart size={20} fill="#ef4444" color="#ef4444" />
                                                        </button>
                                                    </div>
                                                    <div style={styles.savedCardContent} onClick={() => navigate(`/user/properties/${property._id}`)}>
                                                        <h3 style={styles.savedProjectName}>{property.projectName}</h3>
                                                        <div style={styles.savedBuilderInfo}>
                                                            <Building size={14} color="#9ca3af" />
                                                            <span>{property.builderName}</span>
                                                        </div>
                                                        <div style={styles.savedAddressInfo}>
                                                            <MapPin size={14} color="#9ca3af" />
                                                            <span style={styles.savedAddressText}>{property.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "notifications" && (
                        <div style={styles.notificationsContainer}>
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.contentTitle}>Notifications</h2>
                                {notifications.some(n => !n.isRead) && (
                                    <button onClick={markAllAsRead} style={styles.linkBtn}>Mark all as read</button>
                                )}
                            </div>

                            {notifications.filter(n => !n.isRead).length === 0 ? (
                                <div style={styles.placeholder}>
                                    <Bell size={48} strokeWidth={1.5} />
                                    <h3 style={styles.placeholderTitle}>All Caught Up!</h3>
                                    <p style={styles.placeholderText}>You have no notifications at the moment.</p>
                                </div>
                            ) : (
                                <div style={styles.notificationsList}>
                                    {notifications.filter(n => !n.isRead).map((notification) => (
                                        <div
                                            key={notification._id}
                                            style={{
                                                ...styles.notificationItem,
                                                backgroundColor: "#eff6ff",
                                                borderLeft: "4px solid #3b82f6"
                                            }}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div style={styles.notificationContent}>
                                                <h4 style={styles.notificationTitle}>{notification.title}</h4>
                                                <p style={styles.notificationMessage}>{notification.message}</p>
                                                <span style={styles.notificationTime}>
                                                    {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div style={styles.unreadDot} title="Unread" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "settings" && (
                        <UserProfile />
                    )}
                </div>
            </div>

            {/* Start New Group Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Start a New Group</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>
                        <p style={styles.modalSubtitle}>What would you like to buy together?</p>
                        <div style={styles.modalOptions}>
                            <div 
                                style={styles.modalOptionCard} 
                                onClick={() => navigate("/user/properties")}
                            >
                                <div style={{...styles.iconBox, backgroundColor: "#eff6ff", color: "#2563eb", marginBottom: "16px"}}>
                                    <Building size={32} />
                                </div>
                                <h3 style={styles.optionTitle}>Properties</h3>
                                <p style={styles.optionDesc}>Browse real estate projects and join a buying group.</p>
                            </div>
                            <div 
                                style={styles.modalOptionCard} 
                                onClick={() => navigate("/user/dealerships")}
                            >
                                <div style={{...styles.iconBox, backgroundColor: "#fef2f2", color: "#dc2626", marginBottom: "16px"}}>
                                    <Car size={32} />
                                </div>
                                <h3 style={styles.optionTitle}>Vehicles</h3>
                                <p style={styles.optionDesc}>Browse cars and bikes from dealerships to buy in a group.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    pageWrapper: {
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        paddingBottom: "60px",
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "40px 24px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        flexWrap: "wrap",
        gap: "20px",
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    avatar: {
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        backgroundColor: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "600",
        color: "#6b7280",
        overflow: "hidden",
        border: "3px solid white",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    avatarImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    greeting: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#111827",
        margin: "0 0 4px 0",
        letterSpacing: "-0.5px",
    },
    userSince: {
        color: "#6b7280",
        fontSize: "14px",
        fontWeight: "500",
    },
    createBtn: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#111827", // Dark theme button
        color: "#fff",
        border: "none",
        padding: "14px 28px",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "15px",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
    },
    statCard: {
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "20px",
        border: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.2s",
        ':hover': {
            transform: "translateY(-4px)",
        }
    },
    iconBox: {
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#111827",
        lineHeight: "1.2",
    },
    statLabel: {
        color: "#6b7280",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    tabsContainer: {
        display: "flex",
        gap: "8px",
        backgroundColor: "white",
        padding: "6px",
        borderRadius: "16px",
        marginBottom: "32px",
        width: "fit-content",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
    },
    tab: {
        padding: "12px 24px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "transparent",
        color: "#6b7280",
        fontWeight: "600",
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    activeTab: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
    },
    contentArea: {
        minHeight: "400px",
        animation: "fadeIn 0.3s ease-in-out",
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    contentTitle: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#1f2937",
    },
    linkBtn: {
        background: "none",
        border: "none",
        color: "#2563eb",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "underline",
    },
    placeholder: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px",
        color: "#9ca3af",
        backgroundColor: "white",
        borderRadius: "20px",
        border: "1px dashed #e5e7eb",
        textAlign: "center",
    },
    placeholderTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#1f2937",
        marginTop: "16px",
        marginBottom: "8px",
    },
    placeholderText: {
        fontSize: "15px",
        color: "#6b7280",
        marginBottom: "24px",
        maxWidth: "400px",
    },
    secondaryBtn: {
        backgroundColor: "white",
        color: "#374151",
        border: "1px solid #d1d5db",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    notificationsContainer: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        border: "1px solid #f3f4f6",
    },
    notificationsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    notificationItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "16px 20px",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s",
        border: "1px solid #e5e7eb",
        ':hover': {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "4px",
        marginTop: 0,
    },
    notificationMessage: {
        fontSize: "14px",
        color: "#4b5563",
        marginBottom: "8px",
        marginTop: 0,
    },
    notificationTime: {
        fontSize: "12px",
        color: "#9ca3af",
        fontWeight: "500",
    },
    unreadDot: {
        width: "10px",
        height: "10px",
        backgroundColor: "#3b82f6",
        borderRadius: "50%",
        marginTop: "6px",
    },
    savedGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
    },
    savedCard: {
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        transition: "transform 0.2s",
        ':hover': { transform: "translateY(-4px)" }
    },
    savedCardImgBox: {
        position: "relative",
        height: "180px",
        backgroundColor: "#f3f4f6",
    },
    savedCardImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    heartBtn: {
        position: "absolute",
        top: "12px",
        right: "12px",
        backgroundColor: "white",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 2,
    },
    savedCardContent: {
        padding: "16px",
    },
    savedProjectName: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#111827",
        margin: "0 0 8px 0",
    },
    savedBuilderInfo: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "4px",
    },
    savedAddressInfo: {
        display: "flex",
        alignItems: "flex-start",
        gap: "6px",
        fontSize: "13px",
        color: "#6b7280",
    },
    savedAddressText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "32px",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        animation: "slideUp 0.3s ease-out",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    modalTitle: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#111827",
        margin: 0,
    },
    closeBtn: {
        background: "none",
        border: "none",
        color: "#6b7280",
        cursor: "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.2s",
        ':hover': {
            color: "#111827",
        }
    },
    modalSubtitle: {
        fontSize: "16px",
        color: "#6b7280",
        marginBottom: "32px",
        marginTop: 0,
    },
    modalOptions: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
    },
    modalOptionCard: {
        border: "2px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        ':hover': {
            borderColor: "#2563eb",
            backgroundColor: "#f8fafc",
            transform: "translateY(-4px)"
        }
    },
    optionTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "8px",
        marginTop: 0,
    },
    optionDesc: {
        fontSize: "14px",
        color: "#6b7280",
        margin: 0,
        lineHeight: "1.5",
    }
};

export default UserDashboard;
