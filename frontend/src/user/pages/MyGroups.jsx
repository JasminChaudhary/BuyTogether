import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Building, Users, Clock, AlertCircle, MessageSquare, ArrowRight } from "lucide-react";
import api from "../../common/api";
import StatusBadge from "../../common/components/StatusBadge";
import GroupProgressBar from "../../common/components/GroupProgressBar";

const MyGroups = ({ embedded }) => {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyGroups();
    }, []);

    const fetchMyGroups = async () => {
        setLoading(true);
        setError("");
        try {
            const [propRes, dealRes] = await Promise.all([
                api.get("/group-members/my-groups").catch(() => ({ data: [] })),
                api.get("/dealership-group-members/my-groups").catch(() => ({ data: [] }))
            ]);

            const props = propRes.data.map(m => ({ ...m, type: 'property' }));
            const deals = dealRes.data.map(m => ({ ...m, type: 'dealership' }));

            const combined = [...props, ...deals].sort((a, b) =>
                new Date(b.joinedAt) - new Date(a.joinedAt)
            );

            setMemberships(combined);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch your groups");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getTokenStatusBadge = (status) => {
        const styles = {
            PAID: { bg: "#d1fae5", color: "#065f46", text: "Token Paid" },
            REFUNDED: { bg: "#dbeafe", color: "#1e40af", text: "Refunded" },
            FORFEITED: { bg: "#fee2e2", color: "#991b1b", text: "Forfeited" },
            PENDING: { bg: "#fef3c7", color: "#92400e", text: "Payment Pending" },
        };
        const style = styles[status] || styles.PENDING;
        return (
            <span style={{
                backgroundColor: style.bg,
                color: style.color,
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                display: "inline-block",
            }}>
                {style.text}
            </span>
        );
    };

    const canAccessChat = (group) => {
        return group.status === "CHAT_ENABLED" || group.status === "SUCCESSFUL";
    };

    const getImageUrl = (images) => {
        if (!images || images.length === 0) return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80";
        const img = images[0];
        return img.startsWith('http') ? img : `http://localhost:5000/${img.replace(/\\/g, '/')}`;
    };

    return (
        <div style={embedded ? {} : styles.container}>
            {!embedded && (
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>My Groups</h1>
                        <p style={styles.subtitle}>Track your active and past group buying participations</p>
                    </div>
                </div>
            )}

            {loading && (
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p>Loading your groups...</p>
                </div>
            )}

            {error && (
                <div style={styles.errorContainer}>
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {!loading && memberships.length === 0 && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🏢</div>
                    <h3 style={styles.emptyTitle}>No Groups Yet</h3>
                    <p style={styles.emptyText}>
                        You haven't joined any groups yet. Start your journey by browsing available properties or dealerships!
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                        <button onClick={() => navigate("/user/properties")} style={styles.browseBtn}>
                            Browse Properties
                        </button>
                        <button onClick={() => navigate("/user/dealerships")} style={{ ...styles.browseBtn, backgroundColor: "#4f46e5" }}>
                            Browse Dealerships
                        </button>
                    </div>
                </div>
            )}

            {!loading && memberships.length > 0 && (
                <div style={styles.grid}>
                    {memberships.map((membership) => {
                        const group = membership.group;
                        if (!group) return null;

                        const isDealership = membership.type === 'dealership';
                        const item = isDealership ? group.dealership : group.property;

                        if (!item) return null;

                        const title = isDealership ? item.name : item.projectName;
                        const subtitle = isDealership ? item.brand : item.builderName;
                        const iconUrl = getImageUrl(item.images);
                        const detailPath = isDealership ? `/user/dealerships/${item._id}` : `/user/properties/${item._id}`;
                        const chatPath = isDealership ? `/user/dealership-groups/${group._id}/chat` : `/user/groups/${group._id}/chat`;

                        return (
                            <div key={membership._id} style={styles.card}>
                                <div style={styles.imageContainer}>
                                    <img
                                        src={iconUrl}
                                        alt={title}
                                        style={styles.cardImage}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                                        }}
                                    />
                                    <div style={styles.statusOverlay}>
                                        <StatusBadge status={group.status} />
                                    </div>
                                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "8px", color: "white", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                        {isDealership ? "🚗 Dealership" : "🏢 Property"}
                                    </div>
                                </div>

                                <div style={styles.cardContent}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={styles.projectName}>{title}</h3>
                                        <div style={styles.builderRow}>
                                            <Building size={14} />
                                            <span>{subtitle}</span>
                                        </div>
                                    </div>

                                    <div style={styles.detailsList}>
                                        <div style={styles.detailItem}>
                                            <MapPin size={16} className="text-gray-400" />
                                            <span style={styles.detailText}>{item.location || item.address}, {item.city.name}</span>
                                        </div>
                                        <div style={styles.detailItem}>
                                            <Calendar size={16} className="text-gray-400" />
                                            <span style={styles.detailText}>Joined {formatDate(membership.joinedAt)}</span>
                                        </div>
                                    </div>

                                    <div style={styles.progressSection}>
                                        <div style={styles.progressHeader}>
                                            <span style={styles.progressLabel}>Group Progress</span>
                                            <span style={styles.progressValue}>{group.memberCount || 0}/{item.minimumGroupSize || 5} Members</span>
                                        </div>
                                        <GroupProgressBar
                                            current={group.memberCount || 0}
                                            required={item.minimumGroupSize || 5}
                                            status={group.status}
                                        />
                                    </div>

                                    <div style={styles.tokenSection}>
                                        <div style={styles.tokenRow}>
                                            <span style={styles.tokenLabel}>Token Amount</span>
                                            <span style={styles.tokenValue}>{formatCurrency(item.tokenAmount || 5000)}</span>
                                        </div>
                                        <div style={styles.tokenStatus}>
                                            {getTokenStatusBadge(membership.tokenStatus)}
                                        </div>
                                    </div>

                                    <div style={styles.cardFooter}>
                                        <button
                                            onClick={() => navigate(detailPath)}
                                            style={styles.detailsBtn}
                                        >
                                            View Details <ArrowRight size={16} />
                                        </button>

                                        {canAccessChat(group) && (
                                            <button
                                                onClick={() => navigate(chatPath)}
                                                style={styles.chatBtn}
                                            >
                                                <MessageSquare size={16} /> Chat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px",
    },
    header: {
        marginBottom: "32px",
    },
    title: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#111827",
        marginBottom: "8px",
    },
    subtitle: {
        fontSize: "16px",
        color: "#6b7280",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        color: "#6b7280",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "3px solid #e5e7eb",
        borderTop: "3px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "16px",
    },
    errorContainer: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
    },
    emptyState: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "60px 24px",
        textAlign: "center",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    emptyIcon: {
        fontSize: "48px",
        marginBottom: "16px",
        display: "block",
    },
    emptyTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "12px",
    },
    emptyText: {
        fontSize: "16px",
        color: "#6b7280",
        maxWidth: "500px",
        margin: "0 auto 24px auto",
        lineHeight: "1.5",
    },
    browseBtn: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "24px",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        ':hover': {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }
    },
    imageContainer: {
        height: "200px",
        position: "relative",
        backgroundColor: "#f3f4f6",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    statusOverlay: {
        position: "absolute",
        top: "12px",
        left: "12px",
    },
    cardContent: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    cardHeader: {
        marginBottom: "16px",
    },
    projectName: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "4px",
        lineHeight: "1.3",
    },
    builderRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: "#6b7280",
    },
    detailsList: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "20px",
    },
    detailItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        color: "#4b5563",
    },
    detailText: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    progressSection: {
        marginBottom: "20px",
        backgroundColor: "#f9fafb",
        padding: "12px",
        borderRadius: "8px",
    },
    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
        fontSize: "13px",
        fontWeight: "500",
    },
    progressLabel: {
        color: "#6b7280",
    },
    progressValue: {
        color: "#111827",
        fontWeight: "600",
    },
    tokenSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderTop: "1px solid #f3f4f6",
        borderBottom: "1px solid #f3f4f6",
        marginBottom: "20px",
    },
    tokenRow: {
        display: "flex",
        flexDirection: "column",
    },
    tokenLabel: {
        fontSize: "12px",
        color: "#6b7280",
        marginBottom: "2px",
    },
    tokenValue: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#111827",
    },
    cardFooter: {
        display: "flex",
        gap: "12px",
        marginTop: "auto",
    },
    detailsBtn: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: "white",
        color: "#374151",
        border: "1px solid #d1d5db",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    chatBtn: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
};

export default MyGroups;
