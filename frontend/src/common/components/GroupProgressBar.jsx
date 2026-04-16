import React from "react";

const GroupProgressBar = ({ current, required, status }) => {
    const percentage = Math.min((current / required) * 100, 100);

    // Determine color based on progress
    let barColor = "#ef4444"; // red - far from goal
    let bgColor = "#fee2e2";

    if (percentage >= 100) {
        barColor = "#10b981"; // green - qualified
        bgColor = "#d1fae5";
    } else if (percentage >= 70) {
        barColor = "#f59e0b"; // yellow - close to goal
        bgColor = "#fef3c7";
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.label}>
                    {current} of {required} buyers joined
                </span>
                <span style={{ ...styles.badge, backgroundColor: barColor }}>
                    {Math.round(percentage)}%
                </span>
            </div>
            <div style={{ ...styles.track, backgroundColor: bgColor }}>
                <div
                    style={{
                        ...styles.bar,
                        width: `${percentage}%`,
                        backgroundColor: barColor,
                    }}
                />
            </div>
            {status && (
                <div style={styles.statusText}>
                    Status: <strong>{status}</strong>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: "100%",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
    },
    badge: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#ffffff",
        padding: "4px 8px",
        borderRadius: "12px",
    },
    track: {
        width: "100%",
        height: "12px",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
    },
    bar: {
        height: "100%",
        transition: "width 0.3s ease",
        borderRadius: "6px",
    },
    statusText: {
        fontSize: "12px",
        color: "#6b7280",
        marginTop: "6px",
    },
};

export default GroupProgressBar;
