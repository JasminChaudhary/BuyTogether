import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../common/api";

const CitySelectionModal = ({ isOpen, onClose, onCitySelect }) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchActiveCities();
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchActiveCities = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/cities/active");
            setCities(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch cities");
        } finally {
            setLoading(false);
        }
    };

    const handleCityClick = async (city) => {
        try {
            // Save to database
            await api.put("/user/city", { cityId: city._id });

            // Update localStorage
            localStorage.setItem("selectedCity", JSON.stringify(city));

            // Notify parent component
            onCitySelect(city);
            onClose();
        } catch (err) {
            console.error("Error saving city preference:", err);
            setError(err.response?.data?.message || "Failed to save city preference");
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <span style={styles.locationIcon}>📍</span>
                    </div>
                    <h2 style={styles.title}>Choose Your City</h2>
                    <p style={styles.subtitle}>
                        Select your preferred city to see relevant properties
                    </p>
                </div>

                {loading && <p style={styles.loadingText}>Loading cities...</p>}
                {error && <p style={styles.errorText}>{error}</p>}

                {!loading && cities.length === 0 && (
                    <p style={styles.emptyText}>
                        No cities available at the moment.
                    </p>
                )}

                {!loading && cities.length > 0 && (
                    <div style={styles.cityGrid}>
                        {cities.map((city) => (
                            <div
                                key={city._id}
                                onClick={() => handleCityClick(city)}
                                style={styles.cityCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(239, 68, 68, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                                }}
                            >
                                <div style={styles.cityIcon}>
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <h3 style={styles.cityName}>{city.name}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999, // Ensure it's on top of everything including navbar
        backdropFilter: "blur(4px)",
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        animation: "slideIn 0.3s ease-out",
        boxSizing: "border-box", // Ensure padding doesn't affect width calculations violently
    },
    header: {
        textAlign: "center",
        marginBottom: "30px",
    },
    iconContainer: {
        marginBottom: "16px",
    },
    locationIcon: {
        fontSize: "32px",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "8px",
        margin: 0,
    },
    subtitle: {
        fontSize: "15px",
        color: "#6b7280",
        margin: 0,
        marginTop: "8px",
    },
    loadingText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "16px",
        padding: "40px 0",
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
    emptyText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "16px",
        padding: "40px 20px",
    },
    cityGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
    },
    cityCard: {
        backgroundColor: "#ffffff",
        border: "2px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
    },
    cityIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#fef2f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cityName: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1f2937",
        margin: 0,
    },
};

export default CitySelectionModal;
