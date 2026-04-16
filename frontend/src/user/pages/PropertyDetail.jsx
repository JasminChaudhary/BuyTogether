import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin, Building, Home, Users, Calendar,
    FileText, CheckCircle, Clock, Share2, Heart,
    ArrowLeft, ChevronRight, ShieldCheck
} from "lucide-react";
import api from "../../common/api";
import GroupProgressBar from "../../common/components/GroupProgressBar";
import StatusBadge from "../../common/components/StatusBadge";
import JoinGroupDialog from "../components/JoinGroupDialog";
import MapComponent from "../../common/components/MapComponent";
import { API_BASE_URL } from "../../common/config";

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [groupStatus, setGroupStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        fetchPropertyDetails();
    }, [id]);

    const fetchPropertyDetails = async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch property details
            const propResponse = await api.get(`/properties/${id}`);
            setProperty(propResponse.data);
            if (propResponse.data.images && propResponse.data.images.length > 0) {
                // Initialize selected image with the first image
                const firstImg = propResponse.data.images[0];
                setSelectedImage(firstImg.startsWith('http') ? firstImg : `${API_BASE_URL}/${firstImg.replace(/\\/g, '/')}`);
            }

            // Fetch group status if currentGroup exists
            if (propResponse.data.currentGroup) {
                const groupResponse = await api.get(
                    `/group-members/status/${propResponse.data.currentGroup._id}`
                );
                setGroupStatus(groupResponse.data);
            }

            // Fetch saved properties to determine if this one is saved
            try {
                const savedRes = await api.get('/user/saved-properties');
                if (savedRes.data && savedRes.data.some(p => p._id === id)) {
                    setIsSaved(true);
                }
            } catch (err) {
                // Ignore saved properties fetch error
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch property details");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (paymentIntentId) => {
        try {
            await api.post(`/group-members/join/${property._id}`, { paymentIntentId });
            setShowJoinDialog(false);
            // Refresh property details
            await fetchPropertyDetails();
            alert("Successfully joined the group!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to join group");
        }
    };

    const handleToggleSave = async () => {
        try {
            await api.post(`/user/saved-properties/${property._id}`);
            setIsSaved(!isSaved);
        } catch (err) {
            console.error("Failed to toggle save:", err);
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
        return new Date() > new Date(property.groupJoiningDeadline);
    };

    const isGroupFull = () => {
        const group = property.currentGroup;
        return group && (group.memberCount || 0) >= property.minimumGroupSize;
    };

    const canJoinGroup = () => {
        if (!property || !groupStatus) return false;
        if (groupStatus.isMember) return false;
        if (isDeadlinePassed()) return false;
        if (isGroupFull()) return false;
        const group = property.currentGroup;
        return group && (group.status === "OPEN" || group.status === "QUALIFIED");
    };

    const canAccessChat = () => {
        if (!groupStatus || !groupStatus.isMember) return false;
        const group = property.currentGroup;
        return group && (group.status === "CHAT_ENABLED" || group.status === "SUCCESSFUL");
    };

    if (loading) {
        return <div style={styles.loading}>Loading property details...</div>;
    }

    if (error || !property) {
        return (
            <div style={styles.container}>
                <div style={styles.errorBox}>
                    <p style={styles.errorText}>{error || "Property not found"}</p>
                    <button onClick={() => navigate("/user/properties")} style={styles.backBtn}>
                        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Properties
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <JoinGroupDialog
                    isOpen={showJoinDialog}
                    property={property}
                    onClose={() => setShowJoinDialog(false)}
                    onConfirm={handleJoinGroup}
                />

                {/* Breadcrumb / Back Navigation */}
                <div style={styles.topNav}>
                    <button onClick={() => navigate("/user/properties")} style={styles.backLink}>
                        <ArrowLeft size={18} />
                        Back to Properties
                    </button>
                    <div style={styles.topActions}>
                        <button style={styles.actionIconBtn}><Share2 size={18} /></button>
                        <button 
                            style={{...styles.actionIconBtn, backgroundColor: isSaved ? '#fef2f2' : 'white', borderColor: isSaved ? '#fca5a5' : '#e5e7eb'}} 
                            onClick={handleToggleSave}
                            title={isSaved ? "Unsave Property" : "Save Property"}
                        >
                            <Heart size={18} fill={isSaved ? "#ef4444" : "none"} color={isSaved ? "#ef4444" : "#6b7280"} />
                        </button>
                    </div>
                </div>

                <div style={styles.contentGrid}>
                    {/* LEFT COLUMN: Main Content */}
                    <div style={styles.mainColumn}>

                        {/* Header Section */}
                        <div style={styles.headerSection}>
                            <h1 style={styles.title}>{property.projectName}</h1>
                            <div style={styles.locationRow}>
                                <MapPin size={16} className="text-gray-500" />
                                <span style={styles.locationText}>{property.location}, {property.city.name}</span>
                            </div>
                            <div style={styles.builderRow}>
                                <Building size={16} className="text-gray-500" />
                                <span style={styles.builderText}>Developed by <strong>{property.builderName}</strong></span>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div style={styles.gallerySection}>
                            <div style={styles.mainImageContainer}>
                                <img
                                    src={selectedImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"}
                                    alt="Property Main"
                                    style={styles.mainImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                                    }}
                                />
                                {property.currentGroup && (
                                    <div style={styles.statusOverlay}>
                                        <StatusBadge status={property.currentGroup.status} />
                                    </div>
                                )}
                            </div>
                            {property.images && property.images.length > 1 && (
                                <div style={styles.thumbnailGrid}>
                                    {property.images.map((img, index) => {
                                        const imgUrl = img.startsWith('http') ? img : `${API_BASE_URL}/${img.replace(/\\/g, '/')}`;
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    ...styles.thumbnailItem,
                                                    borderColor: selectedImage === imgUrl ? '#3b82f6' : 'transparent'
                                                }}
                                                onClick={() => setSelectedImage(imgUrl)}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`Thumbnail ${index}`}
                                                    style={styles.thumbnailImage}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Key Features Grid */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Overview</h2>
                            <div style={styles.featuresGrid}>
                                <div style={styles.featureCard}>
                                    <Home size={24} className="text-blue-600 mb-2" />
                                    <span style={styles.featureLabel}>Type</span>
                                    <span style={styles.featureValue}>{property.propertyType}</span>
                                </div>
                                <div style={styles.featureCard}>
                                    <Users size={24} className="text-blue-600 mb-2" />
                                    <span style={styles.featureLabel}>Group Size</span>
                                    <span style={styles.featureValue}>{property.minimumGroupSize} Members</span>
                                </div>
                                <div style={styles.featureCard}>
                                    <ShieldCheck size={24} className="text-blue-600 mb-2" />
                                    <span style={styles.featureLabel}>RERA</span>
                                    <span style={styles.featureValue}>Verified</span>
                                </div>
                                <div style={styles.featureCard}>
                                    <Calendar size={24} className="text-blue-600 mb-2" />
                                    <span style={styles.featureLabel}>Possession</span>
                                    <span style={styles.featureValue}>Dec 2026</span>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        {property.coordinates && property.coordinates.lat && property.coordinates.lng && (
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Location</h2>
                                <div style={styles.mapContainer}>
                                    <MapComponent
                                        center={[property.coordinates.lat, property.coordinates.lng]}
                                        zoom={15}
                                        height="100%"
                                        marker={[property.coordinates.lat, property.coordinates.lng]}
                                        showControls={true}
                                    />
                                </div>
                                <p style={styles.mapAddress}>{property.location}</p>
                            </div>
                        )}

                        {/* Group Rules */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Group Rules & Terms</h2>
                            <div style={styles.rulesCard}>
                                <FileText size={20} className="text-gray-500 mb-3" />
                                <p style={styles.rulesText}>{property.groupRules || "No specific rules defined for this group."}</p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar */}
                    <div style={styles.sidebarColumn}>
                        <div style={styles.stickyCard}>
                            <div style={styles.priceHeader}>
                                <span style={styles.priceLabel}>Starting from</span>
                                <h2 style={styles.priceValue}>{formatCurrency(property.minimumPrice)}</h2>
                            </div>

                            <div style={styles.tokenBox}>
                                <div style={styles.tokenRow}>
                                    <span style={styles.tokenLabel}>Booking Token</span>
                                    <span style={styles.tokenValue}>{formatCurrency(property.tokenAmount)}</span>
                                </div>
                                <p style={styles.tokenNote}>Fully refundable until group formation</p>
                            </div>

                            {property.currentGroup && (
                                <div style={styles.progressSection}>
                                    <div style={styles.progressHeader}>
                                        <span style={styles.progressTitle}>Group Progress</span>
                                        <span style={styles.progressCount}>{property.currentGroup.memberCount || 0}/{property.minimumGroupSize} joined</span>
                                    </div>
                                    <GroupProgressBar
                                        current={property.currentGroup.memberCount || 0}
                                        required={property.minimumGroupSize}
                                        status={property.currentGroup.status}
                                    />
                                    <div style={styles.deadlineRow}>
                                        <Clock size={14} className={isDeadlinePassed() ? "text-red-500" : "text-gray-500"} />
                                        <span style={{
                                            ...styles.deadlineText,
                                            color: isDeadlinePassed() ? "#ef4444" : "#6b7280"
                                        }}>
                                            {isDeadlinePassed() ? "Deadline Passed" : `Ends ${formatDate(property.groupJoiningDeadline)}`}
                                        </span>
                                    </div>
                                </div>
                            )}

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
                                        onClick={() => navigate(`/user/groups/${property.currentGroup._id}/chat`)}
                                        style={styles.secondaryBtn}
                                    >
                                        Open Group Chat
                                    </button>
                                )}
                            </div>

                            {property.brochure && (
                                <a
                                    href={`${API_BASE_URL}/${property.brochure}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.brochureLink}
                                >
                                    <FileText size={16} /> Download Brochure
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        paddingBottom: "80px",
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "20px 24px",
    },
    loading: {
        textAlign: "center",
        padding: "100px 0",
        color: "#6b7280",
        fontSize: "18px",
    },
    errorBox: {
        textAlign: "center",
        padding: "60px 0",
    },
    errorText: {
        color: "#ef4444",
        marginBottom: "20px",
    },
    topNav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    backLink: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        color: "#6b7280",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        padding: 0,
        hover: { color: "#111827" }
    },
    topActions: {
        display: "flex",
        gap: "12px",
    },
    actionIconBtn: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280",
        cursor: "pointer",
        transition: "all 0.2s",
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
    headerSection: {
        marginBottom: "8px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "800",
        color: "#111827",
        marginBottom: "12px",
        lineHeight: "1.2",
    },
    locationRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "8px",
        color: "#4b5563",
    },
    locationText: {
        fontSize: "16px",
        fontWeight: "500",
    },
    builderRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "#6b7280",
        fontSize: "15px",
    },
    gallerySection: {
        marginBottom: "8px",
    },
    mainImageContainer: {
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#e5e7eb",
        marginBottom: "12px",
        position: "relative",
    },
    mainImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    statusOverlay: {
        position: "absolute",
        top: "20px",
        left: "20px",
    },
    thumbnailGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: "12px",
    },
    thumbnailItem: {
        height: "80px",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        border: "2px solid transparent",
        transition: "all 0.2s",
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    section: {
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid #f3f4f6",
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "24px",
    },
    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
    },
    featureCard: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
    },
    featureLabel: {
        fontSize: "13px",
        color: "#6b7280",
        fontWeight: "600",
        marginBottom: "4px",
    },
    featureValue: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#1f2937",
    },
    mapContainer: {
        height: "300px",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "12px",
        border: "1px solid #e5e7eb",
    },
    mapAddress: {
        fontSize: "14px",
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    rulesCard: {
        backgroundColor: "#fefce8", // Light yellow for rules
        border: "1px solid #fef9c3",
        borderRadius: "12px",
        padding: "20px",
    },
    rulesText: {
        fontSize: "15px",
        color: "#854d0e",
        lineHeight: "1.6",
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
        fontSize: "32px",
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
    brochureLink: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
        fontSize: "14px",
        color: "#6b7280",
        textDecoration: "none",
        marginTop: "16px",
    },
};

export default PropertyDetail;
