import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";

const CitySelection = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCity, setSelectedCity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveCities();
        // Check if city already selected
        const storedCity = localStorage.getItem("selectedCity");
        if (storedCity) {
            setSelectedCity(JSON.parse(storedCity));
        }
    }, []);

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

    const handleCitySelect = async (city) => {
        try {
            // Save to database
            await api.put("/user/city", { cityId: city._id });

            // Update localStorage
            localStorage.setItem("selectedCity", JSON.stringify(city));
            setSelectedCity(city);

            // Navigate to user landing page after selection
            setTimeout(() => {
                navigate("/user");
            }, 500);
        } catch (err) {
            console.error("Error saving city preference:", err);
            setError(err.response?.data?.message || "Failed to save city preference");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Select Your City</h1>
                <p style={styles.subtitle}>
                    Choose a city to explore group buying opportunities
                </p>

                {loading && <p style={styles.loadingText}>Loading cities...</p>}
                {error && <p style={styles.errorText}>{error}</p>}

                {!loading && cities.length === 0 && (
                    <p style={styles.emptyText}>
                        No cities available at the moment. Please check back later.
                    </p>
                )}

                {!loading && cities.length > 0 && (
                    <div style={styles.cityGrid}>
                        {cities.map((city) => (
                            <div
                                key={city._id}
                                onClick={() => handleCitySelect(city)}
                                style={{
                                    ...styles.cityCard,
                                    ...(selectedCity?._id === city._id ? styles.cityCardSelected : {}),
                                }}
                            >
                                <h3 style={styles.cityName}>{city.name}</h3>
                                <p style={styles.stateName}>{city.state}</p>
                                {selectedCity?._id === city._id && (
                                    <div style={styles.selectedBadge}>Selected</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {selectedCity && (
                    <div style={styles.selectedInfo}>
                        <p style={styles.selectedText}>
                            Currently selected: <strong>{selectedCity.name}, {selectedCity.state}</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "40px",
        maxWidth: "800px",
        width: "100%",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "10px",
        color: "#1f2937",
    },
    subtitle: {
        fontSize: "16px",
        textAlign: "center",
        color: "#6b7280",
        marginBottom: "30px",
    },
    loadingText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "16px",
    },
    errorText: {
        textAlign: "center",
        color: "#ef4444",
        fontSize: "16px",
    },
    emptyText: {
        textAlign: "center",
        color: "#6b7280",
        fontSize: "16px",
        padding: "40px 20px",
    },
    cityGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "20px",
    },
    cityCard: {
        backgroundColor: "#f9fafb",
        border: "2px solid #e5e7eb",
        borderRadius: "8px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "center",
        position: "relative",
    },
    cityCardSelected: {
        backgroundColor: "#dbeafe",
        borderColor: "#3b82f6",
    },
    cityName: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "6px",
    },
    stateName: {
        fontSize: "14px",
        color: "#6b7280",
        margin: 0,
    },
    selectedBadge: {
        position: "absolute",
        top: "8px",
        right: "8px",
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        fontSize: "10px",
        fontWeight: "600",
        padding: "4px 8px",
        borderRadius: "4px",
    },
    selectedInfo: {
        backgroundColor: "#ecfdf5",
        border: "1px solid #10b981",
        borderRadius: "8px",
        padding: "16px",
        marginTop: "20px",
    },
    selectedText: {
        color: "#065f46",
        fontSize: "14px",
        margin: 0,
        textAlign: "center",
    },
};

export default CitySelection;
