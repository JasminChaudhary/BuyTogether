import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";
import { MapPin, Phone, User, Car } from "lucide-react";

const DealershipListing = () => {
    const [dealerships, setDealerships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCity, setSelectedCity] = useState(null);
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
            fetchDealerships(city._id);
        } catch (error) {
            console.error("Error parsing city:", error);
            navigate("/user");
        }
    }, [navigate]);

    const fetchDealerships = async (cityId) => {
        setLoading(true);
        setError("");
        try {
            // Use the getDealershipsByCity endpoint which is now public/protected
            const response = await api.get(`/dealerships/city/${cityId}`);
            setDealerships(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch dealerships");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Car Dealerships in {selectedCity?.name}</h1>
                    <p style={styles.subtitle}>
                        Find authorized dealerships for your group buying needs
                    </p>
                </div>
                <button onClick={() => navigate("/user")} style={styles.backBtn}>
                    ← Back to Home
                </button>
            </div>

            {loading && <p style={styles.loadingText}>Loading dealerships...</p>}
            {error && <p style={styles.errorText}>{error}</p>}

            {!loading && dealerships.length === 0 && (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🚗</div>
                    <h3 style={styles.emptyTitle}>No Dealerships Found</h3>
                    <p style={styles.emptyText}>
                        There are no active dealerships in {selectedCity?.name} at the moment.
                    </p>
                </div>
            )}

            {!loading && dealerships.length > 0 && (
                <div style={styles.grid}>
                    {dealerships.map((dealership) => (
                        <div
                            key={dealership._id}
                            onClick={() => navigate(`/user/dealerships/${dealership._id}`)}
                            style={{ ...styles.card, cursor: "pointer" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            {dealership.images && dealership.images.length > 0 && (
                                <div style={{ ...styles.coverImageWrapper, marginBottom: '16px' }}>
                                    <img
                                        src={dealership.images[0].startsWith('http') ? dealership.images[0] : `http://localhost:5000/${dealership.images[0].replace(/\\/g, '/')}`}
                                        alt={dealership.name}
                                        style={styles.coverImage}
                                    />
                                </div>
                            )}
                            <div style={styles.cardHeader}>
                                <div style={styles.iconWrapper}>
                                    <Car size={24} color="#3b82f6" />
                                </div>
                                <h3 style={styles.name}>{dealership.name}</h3>
                                <div style={styles.brandBadge}>{dealership.brand}</div>
                            </div>

                            <div style={styles.cardBody}>
                                <div style={styles.infoRow}>
                                    <MapPin size={16} color="#6b7280" style={{ marginTop: '2px' }} />
                                    <span style={styles.value}>{dealership.address}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <User size={16} color="#6b7280" />
                                    <span style={styles.value}>{dealership.contactPerson}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <Phone size={16} color="#6b7280" />
                                    <span style={styles.value}>{dealership.contactPhone}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "16px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#1f2937",
        margin: 0,
    },
    subtitle: {
        fontSize: "16px",
        color: "#6b7280",
        margin: "8px 0 0 0",
    },
    backBtn: {
        backgroundColor: "#6b7280",
        color: "#ffffff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    loadingText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "16px",
        padding: "60px 0",
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
        padding: "80px 20px",
    },
    emptyIcon: {
        fontSize: "64px",
        marginBottom: "20px",
    },
    emptyTitle: {
        fontSize: "24px",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "12px",
    },
    emptyText: {
        fontSize: "16px",
        color: "#6b7280",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "24px",
    },
    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    coverImageWrapper: {
        width: "100%",
        height: "160px",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
    },
    coverImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    cardHeader: {
        marginBottom: "20px",
        borderBottom: "1px solid #f3f4f6",
        paddingBottom: "16px",
    },
    iconWrapper: {
        width: "48px",
        height: "48px",
        backgroundColor: "#eff6ff",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
    },
    name: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#1f2937",
        margin: "0 0 8px 0",
    },
    brandBadge: {
        display: "inline-block",
        backgroundColor: "#e0e7ff",
        color: "#4f46e5",
        fontSize: "12px",
        fontWeight: "600",
        padding: "4px 10px",
        borderRadius: "20px",
    },
    cardBody: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: 1,
    },
    infoRow: {
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
    },
    value: {
        fontSize: "14px",
        color: "#4b5563",
        lineHeight: "1.5",
    },
};

export default DealershipListing;
