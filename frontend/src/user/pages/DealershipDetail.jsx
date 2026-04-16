import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../common/api";
import MapComponent from "../../common/components/MapComponent";
import { MapPin, Phone, User, Building2, Car, Info, Clock, CheckCircle } from "lucide-react";
import GroupProgressBar from "../../common/components/GroupProgressBar";
import StatusBadge from "../../common/components/StatusBadge";
import JoinDealershipGroupDialog from "../components/JoinDealershipGroupDialog";
import { API_BASE_URL } from "../../common/config";

const DealershipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dealership, setDealership] = useState(null);
    const [groupStatus, setGroupStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageViewer, setImageViewer] = useState(null);
    const [showJoinDialog, setShowJoinDialog] = useState(false);

    useEffect(() => {
        fetchDealershipDetails();
    }, [id]);

    const fetchDealershipDetails = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/dealerships/${id}`);
            setDealership(response.data);

            if (response.data.currentGroup) {
                const groupResponse = await api.get(
                    `/dealership-group-members/status/${response.data.currentGroup._id}`
                );
                setGroupStatus(groupResponse.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch dealership details");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (paymentIntentId) => {
        try {
            await api.post(`/dealership-group-members/join/${dealership._id}`, { paymentIntentId });
            setShowJoinDialog(false);
            await fetchDealershipDetails();
            alert("Successfully joined the group!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to join group");
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
            month: "long",
            year: "numeric",
        });
    };

    const isDeadlinePassed = () => {
        if (!dealership?.groupJoiningDeadline) return false;
        return new Date() > new Date(dealership.groupJoiningDeadline);
    };

    const isGroupFull = () => {
        const group = dealership?.currentGroup;
        return group && (group.memberCount || 0) >= (dealership.minimumGroupSize || 5);
    };

    const canJoinGroup = () => {
        if (!dealership) return false;
        if (groupStatus?.isMember) return false;
        if (isDeadlinePassed()) return false;
        if (isGroupFull()) return false;
        const group = dealership.currentGroup;
        return !group || group.status === "OPEN" || group.status === "QUALIFIED";
    };

    const canAccessChat = () => {
        if (!groupStatus || !groupStatus.isMember) return false;
        const group = dealership.currentGroup;
        return group && (group.status === "CHAT_ENABLED" || group.status === "SUCCESSFUL");
    };

    if (loading) {
        return <div style={styles.loading}>Loading dealership details...</div>;
    }

    if (error || !dealership) {
        return (
            <div style={styles.container}>
                <div style={styles.errorBox}>
                    <p style={styles.errorText}>{error || "Dealership not found"}</p>
                    <button onClick={() => navigate("/user/dealerships")} style={styles.backBtn}>
                        ← Back to Dealerships
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <JoinDealershipGroupDialog
                isOpen={showJoinDialog}
                dealership={dealership}
                onClose={() => setShowJoinDialog(false)}
                onConfirm={handleJoinGroup}
            />

            <button onClick={() => navigate("/user/dealerships")} style={styles.backBtn}>
                ← Back to Dealerships
            </button>

            <div style={styles.contentGrid}>
                {/* LEFT COLUMN: Main Content */}
                <div style={styles.mainColumn}>
                    <div style={styles.mainCard}>
                        {/* Header Section */}
                        <div style={styles.header}>
                            <div>
                                <h1 style={styles.title}>{dealership.name}</h1>
                                <p style={styles.subtitle}>Authorized {dealership.brand} Dealership</p>
                            </div>
                        </div>

                        {/* Images Grid */}
                        {dealership.images && dealership.images.length > 0 && (
                            <div style={styles.imageGrid}>
                                {dealership.images.map((img, index) => {
                                    const imgUrl = img.startsWith('http') ? img : `${API_BASE_URL}/${img.replace(/\\/g, '/')}`;
                                    return (
                                        <div key={index} style={styles.imageItem}>
                                            <img
                                                src={imgUrl}
                                                alt={`Dealership ${index + 1}`}
                                                style={styles.image}
                                                onClick={() => setImageViewer(imgUrl)}
                                            />
                                            {index === 0 && dealership.currentGroup && (
                                                <div style={styles.statusOverlay}>
                                                    <StatusBadge status={dealership.currentGroup.status} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Info & Map Section */}
                        <div style={styles.contentSection}>
                            <div style={styles.detailsBox}>
                                <h2 style={styles.sectionTitle}>Dealership Information</h2>
                                <div style={styles.detailsGrid}>
                                    <div style={styles.detailItem}>
                                        <div style={styles.iconWrapper}><MapPin size={20} color="#4b5563" /></div>
                                        <div>
                                            <p style={styles.detailLabel}>Address</p>
                                            <p style={styles.detailValue}>{dealership.address}</p>
                                            <p style={styles.detailSubValue}>{dealership.city.name}</p>
                                        </div>
                                    </div>

                                    <div style={styles.detailItem}>
                                        <div style={styles.iconWrapper}><User size={20} color="#4b5563" /></div>
                                        <div>
                                            <p style={styles.detailLabel}>Contact Person</p>
                                            <p style={styles.detailValue}>{dealership.contactPerson}</p>
                                        </div>
                                    </div>

                                    <div style={styles.detailItem}>
                                        <div style={styles.iconWrapper}><Phone size={20} color="#4b5563" /></div>
                                        <div>
                                            <p style={styles.detailLabel}>Contact Phone</p>
                                            <p style={styles.detailValueHighlight}>{dealership.contactPhone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {dealership.coordinates && dealership.coordinates.lat && (
                                <div style={styles.mapSection}>
                                    <h2 style={styles.sectionTitle}>Location</h2>
                                    <div style={styles.mapContainer}>
                                        <MapComponent
                                            center={[dealership.coordinates.lat, dealership.coordinates.lng]}
                                            zoom={15}
                                            height="400px"
                                            marker={[dealership.coordinates.lat, dealership.coordinates.lng]}
                                            showControls={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sticky Sidebar */}
                <div style={styles.sidebarColumn}>
                    <div style={styles.stickyCard}>
                        <div style={styles.priceHeader}>
                            <span style={styles.priceLabel}>Group Buying Available</span>
                            <h2 style={styles.priceValue}>{dealership.brand} Vehicles</h2>
                        </div>

                        <div style={styles.tokenBox}>
                            <div style={styles.tokenRow}>
                                <span style={styles.tokenLabel}>Booking Token</span>
                                <span style={styles.tokenValue}>{formatCurrency(dealership.tokenAmount || 5000)}</span>
                            </div>
                            <p style={styles.tokenNote}>Fully refundable until group formation</p>
                        </div>

                        <div style={styles.progressSection}>
                            <div style={styles.progressHeader}>
                                <span style={styles.progressTitle}>Group Progress</span>
                                <span style={styles.progressCount}>{dealership.currentGroup?.memberCount || 0}/{dealership.minimumGroupSize || 5} joined</span>
                            </div>
                            <GroupProgressBar
                                current={dealership.currentGroup?.memberCount || 0}
                                required={dealership.minimumGroupSize || 5}
                                status={dealership.currentGroup?.status || 'OPEN'}
                            />
                            {dealership.groupJoiningDeadline && (
                                <div style={styles.deadlineRow}>
                                    <Clock size={14} className={isDeadlinePassed() ? "text-red-500" : "text-gray-500"} />
                                    <span style={{
                                        ...styles.deadlineText,
                                        color: isDeadlinePassed() ? "#ef4444" : "#6b7280"
                                    }}>
                                        {isDeadlinePassed() ? "Deadline Passed" : `Ends ${formatDate(dealership.groupJoiningDeadline)}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={styles.actionArea}>
                            {groupStatus?.isMember ? (
                                <div style={styles.memberStatus}>
                                    <CheckCircle size={20} />
                                    <span>You've joined this group</span>
                                </div>
                            ) : (
                                canJoinGroup() ? (
                                    <button
                                        onClick={() => setShowJoinDialog(true)}
                                        style={styles.primaryBtn}
                                    >
                                        Join Group Now
                                    </button>
                                ) : (
                                    <button disabled style={styles.disabledBtn}>
                                        {isGroupFull() ? "Group Full" : (isDeadlinePassed() ? "Deadline Passed" : "Unavailable")}
                                    </button>
                                )
                            )}

                            {canAccessChat() && (
                                <button
                                    onClick={() => navigate(`/user/dealership-groups/${dealership.currentGroup._id}/chat`)}
                                    style={styles.secondaryBtn}
                                >
                                    Open Group Chat
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Viewer */}
            {imageViewer && (
                <div style={styles.viewerOverlay} onClick={() => setImageViewer(null)}>
                    <img src={imageViewer} style={styles.viewerImage} alt="Fullscreen View" />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1280px", // Increased for grid layout
        margin: "0 auto",
        padding: "20px",
    },
    loading: {
        textAlign: "center",
        padding: "60px",
        color: "#6b7280",
        fontSize: "18px",
    },
    errorBox: {
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#fee2e2",
        borderRadius: "12px",
    },
    errorText: {
        color: "#ef4444",
        fontSize: "18px",
        marginBottom: "20px",
    },
    backBtn: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        marginBottom: "20px",
        transition: "background 0.2s",
    },
    contentGrid: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "40px",
        alignItems: "start",
    },
    mainColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "32px",
    },
    sidebarColumn: {
        position: "sticky",
        top: "24px",
    },
    mainCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "hidden",
        paddingBottom: "32px",
    },
    header: {
        padding: "32px",
        borderBottom: "1px solid #f3f4f6",
        background: "linear-gradient(to right, #f8fafc, #ffffff)",
    },
    title: {
        fontSize: "32px",
        fontWeight: "800",
        color: "#1e293b",
        margin: "0 0 8px 0",
        lineHeight: "1.2",
    },
    subtitle: {
        fontSize: "18px",
        color: "#64748b",
        margin: "0",
        fontWeight: "500",
    },
    imageGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "16px",
        padding: "32px",
    },
    imageItem: {
        height: "200px",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.3s",
    },
    statusOverlay: {
        position: "absolute",
        top: "10px",
        left: "10px",
    },
    contentSection: {
        padding: "0 32px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
    },
    detailsBox: {
        backgroundColor: "#f8fafc",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #e2e8f0",
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "24px",
    },
    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
    },
    detailItem: {
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
    },
    iconWrapper: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: "#e0e7ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#4f46e5",
    },
    detailLabel: {
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "4px",
    },
    detailValue: {
        fontSize: "16px",
        color: "#334155",
        fontWeight: "500",
        lineHeight: "1.4",
    },
    detailSubValue: {
        fontSize: "14px",
        color: "#94a3b8",
        marginTop: "2px",
    },
    detailValueHighlight: {
        fontSize: "18px",
        color: "#3b82f6",
        fontWeight: "700",
    },
    mapSection: {
        // marginTop: "16px",
    },
    mapContainer: {
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        zIndex: 0,
    },
    viewerOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
    },
    viewerImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: "8px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },

    // Sticky Sidebar Styles
    stickyCard: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "32px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: "1px solid #f3f4f6",
    },
    priceHeader: {
        marginBottom: "24px",
        paddingBottom: "24px",
        borderBottom: "1px solid #f3f4f6",
    },
    priceLabel: {
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: "500",
        display: "block",
        marginBottom: "4px",
    },
    priceValue: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#111827",
        margin: 0,
    },
    tokenBox: {
        backgroundColor: "#eff6ff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "24px",
        border: "1px solid #dbeafe",
    },
    tokenRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px",
    },
    tokenLabel: {
        fontSize: "14px",
        color: "#1e40af",
        fontWeight: "600",
    },
    tokenValue: {
        fontSize: "18px",
        color: "#1e3a8a",
        fontWeight: "700",
    },
    tokenNote: {
        fontSize: "12px",
        color: "#60a5fa",
        marginTop: "4px",
    },
    progressSection: {
        marginBottom: "32px",
    },
    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
        fontSize: "14px",
    },
    progressTitle: {
        fontWeight: "600",
        color: "#374151",
    },
    progressCount: {
        color: "#6b7280",
    },
    deadlineRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginTop: "12px",
        fontSize: "13px",
    },
    deadlineText: {
        marginLeft: "4px"
    },
    actionArea: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "20px",
    },
    primaryBtn: {
        width: "100%",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "background-color 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    secondaryBtn: {
        width: "100%",
        backgroundColor: "white",
        color: "#374151",
        border: "1px solid #d1d5db",
        padding: "14px",
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    disabledBtn: {
        width: "100%",
        backgroundColor: "#e5e7eb",
        color: "#9ca3af",
        border: "none",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "not-allowed",
    },
    memberStatus: {
        backgroundColor: "#ecfdf5",
        color: "#059669",
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontWeight: "600",
    },
};

export default DealershipDetail;
