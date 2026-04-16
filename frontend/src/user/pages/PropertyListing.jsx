import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, ArrowRight, Building, Clock, Users, Heart } from "lucide-react"; // Added icons
import api from "../../common/api";
import GroupProgressBar from "../../common/components/GroupProgressBar";
import StatusBadge from "../../common/components/StatusBadge";
import { API_BASE_URL } from "../../common/config";

const PropertyListing = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCity, setSelectedCity] = useState(null);
    const [savedProperties, setSavedProperties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Get selected city
        const storedCity = localStorage.getItem("selectedCity");
        if (!storedCity) {
            navigate("/user");
            return;
        }

        try {
            const city = JSON.parse(storedCity);
            setSelectedCity(city);
            fetchProperties(city._id);
        } catch (error) {
            console.error("Error parsing city:", error);
            navigate("/user");
        }
    }, [navigate]);

    const fetchProperties = async (cityId) => {
        setLoading(true);
        setError("");
        try {
            const [propertiesRes, savedRes] = await Promise.all([
                api.get(`/properties/city/${cityId}`),
                api.get("/user/saved-properties").catch(() => ({ data: [] }))
            ]);
            setProperties(propertiesRes.data);
            setSavedProperties(savedRes.data.map(p => p._id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSave = async (e, propertyId) => {
        e.stopPropagation();
        try {
            await api.post(`/user/saved-properties/${propertyId}`);
            setSavedProperties(prev => 
                prev.includes(propertyId) 
                    ? prev.filter(id => id !== propertyId)
                    : [...prev, propertyId]
            );
        } catch (err) {
            console.error("Failed to toggle save:", err);
        }
    };

    const handlePropertyClick = (propertyId) => {
        navigate(`/user/properties/${propertyId}`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Expired";
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        return `${diffDays} days left`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Properties in {selectedCity?.name}</h1>
                    <p style={styles.subtitle}>
                        Join group buying opportunities for better deals
                    </p>
                </div>
                <button onClick={() => navigate("/user")} style={styles.backBtn}>
                    ← Back to Home
                </button>
            </div>

            {loading && <p style={styles.loadingText}>Loading properties...</p>}
            {error && <p style={styles.errorText}>{error}</p>}

            {!loading && properties.length === 0 && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🏢</div>
                    <h3 style={styles.emptyTitle}>No Properties Available</h3>
                    <p style={styles.emptyText}>
                        There are no active properties in {selectedCity?.name} at the moment.
                        Check back later!
                    </p>
                </div>
            )}

            {!loading && properties.length > 0 && (
                <div style={styles.grid}>
                    {properties.map((property) => {
                        const imageUrl = property.images && property.images.length > 0
                            ? (property.images[0].startsWith('http') ? property.images[0] : `${API_BASE_URL}/${property.images[0].replace(/\\/g, '/')}`)
                            : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";

                        return (
                            <div
                                key={property._id}
                                style={styles.card}
                                onClick={() => handlePropertyClick(property._id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-8px)";
                                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                                }}
                            >
                                {/* Image Header */}
                                <div style={styles.imageContainer}>
                                    <img
                                        src={imageUrl}
                                        alt={property.projectName}
                                        style={styles.image}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                                        }}
                                    />
                                    <div style={styles.badgesOverlay}>
                                        {property.currentGroup && (
                                            <div style={styles.statusBadgeWrapper}>
                                                <StatusBadge status={property.currentGroup.status} />
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        style={styles.heartBtn}
                                        onClick={(e) => handleToggleSave(e, property._id)}
                                        title={savedProperties.includes(property._id) ? "Unsave Property" : "Save Property"}
                                    >
                                        <Heart 
                                            size={20} 
                                            fill={savedProperties.includes(property._id) ? "#ef4444" : "none"} 
                                            color={savedProperties.includes(property._id) ? "#ef4444" : "#6b7280"} 
                                        />
                                    </button>
                                    <div style={styles.priceOverlay}>
                                        From {formatCurrency(property.minimumPrice)}
                                    </div>
                                </div>

                                <div style={styles.cardContent}>
                                    <div style={styles.mainInfo}>
                                        <h3 style={styles.projectName}>{property.projectName}</h3>
                                        <div style={styles.builderInfo}>
                                            <Building size={14} className="text-gray-400" />
                                            <span>{property.builderName}</span>
                                        </div>
                                        <div style={styles.addressInfo}>
                                            <MapPin size={14} className="text-gray-400 shrink-0" />
                                            <span style={styles.addressText}>{property.location}</span>
                                        </div>
                                    </div>

                                    <div style={styles.specsRow}>
                                        <div style={styles.specItem}>
                                            <Home size={16} className="text-blue-500 mb-1" />
                                            <span style={styles.specLabel}>{property.propertyType}</span>
                                        </div>
                                        <div style={styles.specItem}>
                                            <Users size={16} className="text-blue-500 mb-1" />
                                            <span style={styles.specLabel}>Min Group: {property.minimumGroupSize}</span>
                                        </div>
                                    </div>

                                    <div style={styles.tokenRow}>
                                        <span style={styles.tokenLabel}>Booking Token</span>
                                        <span style={styles.tokenValue}>{formatCurrency(property.tokenAmount)}</span>
                                    </div>

                                    {property.currentGroup && (
                                        <div style={styles.progressContainer}>
                                            <GroupProgressBar
                                                current={property.currentGroup.memberCount || 0}
                                                required={property.minimumGroupSize}
                                                status={null}
                                            />
                                        </div>
                                    )}

                                    <div style={styles.cardFooter}>
                                        <div style={styles.deadline}>
                                            <Clock size={14} />
                                            <span>{formatDeadline(property.groupJoiningDeadline)}</span>
                                        </div>
                                        <button style={styles.viewBtn}>
                                            View Details <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
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
        padding: "40px 24px",
        backgroundColor: "#f9fafb", // Light background for contrast
        minHeight: "100vh",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "40px",
        flexWrap: "wrap",
        gap: "20px",
    },
    title: {
        fontSize: "36px",
        fontWeight: "800",
        color: "#111827",
        margin: "0 0 8px 0",
        letterSpacing: "-0.025em",
    },
    subtitle: {
        fontSize: "18px",
        color: "#6b7280",
        margin: 0,
    },
    backBtn: {
        backgroundColor: "#ffffff",
        color: "#374151",
        border: "1px solid #d1d5db",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    loadingText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "18px",
        padding: "80px 0",
    },
    errorText: {
        textAlign: "center",
        color: "#ef4444",
        fontSize: "16px",
        padding: "20px",
        backgroundColor: "#fee2e2",
        borderRadius: "8px",
        marginBottom: "20px",
    },
    emptyState: {
        textAlign: "center",
        padding: "100px 20px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },
    emptyIcon: {
        fontSize: "64px",
        marginBottom: "24px",
    },
    emptyTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "12px",
    },
    emptyText: {
        fontSize: "16px",
        color: "#6b7280",
        maxWidth: "400px",
        margin: "0 auto",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "32px",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Tailwind shadow-md
        display: "flex",
        flexDirection: "column",
        border: "1px solid #f3f4f6",
    },
    imageContainer: {
        position: "relative",
        height: "220px",
        overflow: "hidden",
        backgroundColor: "#e5e7eb",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.5s ease",
    },
    badgesOverlay: {
        position: "absolute",
        top: "16px",
        left: "16px",
        display: "flex",
        gap: "8px",
        zIndex: 10,
    },
    statusBadgeWrapper: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    priceOverlay: {
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "16px",
        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        color: "white",
        fontSize: "20px",
        fontWeight: "700",
        display: "flex",
        alignItems: "flex-end",
    },
    cardContent: {
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    mainInfo: {
        marginBottom: "16px",
    },
    projectName: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "8px",
        lineHeight: "1.3",
    },
    builderInfo: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "14px",
        color: "#6b7280",
        marginBottom: "4px",
        fontWeight: "500",
    },
    addressInfo: {
        display: "flex",
        alignItems: "flex-start",
        gap: "6px",
        fontSize: "14px",
        color: "#6b7280",
    },
    addressText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
    },
    specsRow: {
        display: "flex",
        gap: "12px",
        marginBottom: "16px",
        paddingBottom: "16px",
        borderBottom: "1px solid #f3f4f6",
    },
    specItem: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
    },
    specLabel: {
        fontSize: "13px",
        color: "#4b5563",
        fontWeight: "600",
    },
    tokenRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        backgroundColor: "#eff6ff",
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px dashed #bfdbfe",
    },
    tokenLabel: {
        fontSize: "14px",
        color: "#1e40af",
        fontWeight: "600",
    },
    tokenValue: {
        fontSize: "16px",
        color: "#1e3a8a",
        fontWeight: "800",
    },
    progressContainer: {
        marginBottom: "20px",
    },
    cardFooter: {
        marginTop: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "16px",
        borderTop: "1px solid #f3f4f6",
    },
    deadline: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#ef4444",
        backgroundColor: "#fef2f2",
        padding: "4px 10px",
        borderRadius: "20px",
    },
    viewBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
    heartBtn: {
        position: "absolute",
        top: "16px",
        right: "16px",
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
        zIndex: 10,
        transition: "transform 0.2s ease",
        ':hover': {
            transform: "scale(1.1)",
        }
    },
};

export default PropertyListing;
