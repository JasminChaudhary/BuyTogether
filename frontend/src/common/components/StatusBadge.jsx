import React from "react";

const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case "OPEN":
                return {
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    text: "Open for Joining",
                };
            case "QUALIFIED":
                return {
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    text: "Qualified",
                };
            case "CHAT_ENABLED":
                return {
                    backgroundColor: "#d1fae5",
                    color: "#065f46",
                    text: "Chat Enabled",
                };
            case "SUCCESSFUL":
                return {
                    backgroundColor: "#d1fae5",
                    color: "#065f46",
                    text: "Successful",
                };
            case "DISSOLVED":
                return {
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    text: "Dissolved",
                };
            default:
                return {
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    text: status,
                };
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <span
            style={{
                ...styles.badge,
                backgroundColor: statusStyle.backgroundColor,
                color: statusStyle.color,
            }}
        >
            {statusStyle.text}
        </span>
    );
};

const styles = {
    badge: {
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "16px",
        fontSize: "13px",
        fontWeight: "600",
        textTransform: "capitalize",
    },
};

export default StatusBadge;
