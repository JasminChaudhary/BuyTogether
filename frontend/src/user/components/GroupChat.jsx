import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../common/api";
import io from "socket.io-client";
import { Send, ArrowLeft, MoreVertical, Phone, Video, Info, User, Check, CheckCheck } from "lucide-react";
import { API_BASE_URL } from "../../common/config";

let socket;

const GroupChat = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [groupInfo, setGroupInfo] = useState(null);
    const messagesEndRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(true); // Toggle for mobile if needed

    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem("user") || "{}");
    };

    const user = getCurrentUser();
    const isAdmin = user.role === "ADMIN";

    useEffect(() => {
        // Initialize Socket locally to avoid ghost connections
        const newSocket = io(API_BASE_URL);
        socket = newSocket;

        newSocket.on("connect", () => {
            newSocket.emit("join_group", groupId);
        });

        newSocket.on("receive_message", (message) => {
            setMessages((prev) => {
                // Prevent duplicate messages
                if (prev.find(m => m._id === message._id)) return prev;
                
                const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")._id;
                if (message.sender && message.sender._id === currentUserId) {
                    const tempMsg = prev.find(m => m.isTemp && m.message === message.message);
                    if (tempMsg) {
                        return prev.map(m => m._id === tempMsg._id ? message : m);
                    }
                }
                
                return [...prev, message];
            });
        });

        fetchGroupInfo();
        fetchMessages(); // Initial fetch

        return () => {
            newSocket.disconnect();
        };
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const isDealershipChat = location.pathname.includes('/dealership-groups/');

    const fetchGroupInfo = async () => {
        try {
            if (isAdmin) {
                const url = isDealershipChat ? `/dealership-groups/${groupId}` : `/property-groups/${groupId}`;
                const response = await api.get(url);
                setGroupInfo({ group: response.data });
            } else {
                const url = isDealershipChat ? `/dealership-group-members/status/${groupId}` : `/group-members/status/${groupId}`;
                const response = await api.get(url);
                setGroupInfo(response.data);
            }
        } catch (err) {
            console.error("Error fetching group info:", err);
        }
    };

    const fetchMessages = async () => {
        try {
            const url = isDealershipChat ? `/dealership-group-chat/${groupId}/messages` : `/group-chat/${groupId}/messages`;
            const response = await api.get(url);
            setMessages(response.data);
            setError("");
        } catch (err) {
            if (loading) {
                setError(err.response?.data?.message || "Failed to load messages");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text || sending) return;

        setNewMessage(""); // Clear text field immediately
        setSending(true);

        // Optimistic UI Update: add temporary message instantly
        const tempId = "temp-" + Date.now();
        const tempMsg = {
            _id: tempId,
            message: text,
            sender: user,
            createdAt: new Date().toISOString(),
            isTemp: true
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const url = isDealershipChat ? `/dealership-group-chat/${groupId}/messages` : `/group-chat/${groupId}/messages`;
            const response = await api.post(url, {
                message: text,
            });
            
            // Replace temporary message with confirmed database message
            setMessages((prev) => {
                if (prev.find(m => m._id === response.data._id)) {
                    return prev.filter(m => m._id !== tempId);
                }
                return prev.map(m => m._id === tempId ? response.data : m);
            });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send message");
            // Revert optimistic update on failure
            setMessages(prev => prev.filter(m => m._id !== tempId));
            setNewMessage(text);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = formatDate(message.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading chat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorBox}>
                    <p style={styles.errorText}>{error}</p>
                    <button
                        onClick={() => navigate(isAdmin ? "/admin/groups" : "/user/my-groups")}
                        style={styles.backBtn}
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.layout}>
            {/* Header / Navbar Spacer if needed, or inline back button */}

            <div style={styles.mainContainer}>
                {/* Left Sidebar - Group Info */}
                <div style={{ ...styles.sidebar, display: showSidebar ? 'flex' : 'none' }}>
                    <div style={styles.sidebarHeader}>
                        <button onClick={() => navigate(isAdmin ? "/admin/groups" : "/user/my-groups")} style={styles.iconButton}>
                            <ArrowLeft size={20} />
                        </button>
                        <h2 style={styles.sidebarTitle}>Group Info</h2>
                    </div>

                    <div style={styles.sidebarContent}>
                        {groupInfo?.group && (
                            <>
                                <div style={styles.groupHeader}>
                                    <div style={styles.groupImagePlaceholder}>
                                        {(isDealershipChat ? groupInfo.group.dealership?.name : groupInfo.group.property?.projectName)?.charAt(0) || "G"}
                                    </div>
                                    <h3 style={styles.groupName}>{isDealershipChat ? groupInfo.group.dealership?.name : groupInfo.group.property?.projectName}</h3>
                                    <p style={styles.groupBuilder}>{isDealershipChat ? `${groupInfo.group.dealership?.brand} Dealership` : `by ${groupInfo.group.property?.builderName}`}</p>
                                </div>

                                <div style={styles.sectionDivider} />

                                <div style={styles.membersSection}>
                                    <div style={styles.sectionHeader}>
                                        <span style={styles.sectionTitle}>Members</span>
                                        <span style={styles.memberCount}>{groupInfo.group.members?.length || 0}</span>
                                    </div>

                                    <div style={styles.membersList}>
                                        {groupInfo.group.members?.map((member) => (
                                            <div key={member._id} style={styles.memberItem}>
                                                <div style={styles.memberAvatar}>
                                                    {member.buyer?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={styles.memberDetails}>
                                                    <p style={styles.memberName}>
                                                        {member.buyer?.name}
                                                        {member.buyer?._id === user._id && <span style={styles.youTag}> (You)</span>}
                                                    </p>
                                                    <p style={styles.memberStatus}>
                                                        {member.tokenStatus === "PAID" ? "Active" : "Pending"}
                                                    </p>
                                                </div>
                                                {member.buyer.role === "ADMIN" && (
                                                    <span style={styles.adminBadge}>Admin</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Area - Chat Window */}
                <div style={styles.chatWindow}>
                    {/* Chat Header */}
                    <div style={styles.chatHeader}>
                        <div style={styles.chatHeaderLeft}>
                            <div style={styles.chatAvatar}>
                                {(isDealershipChat ? groupInfo?.group?.dealership?.name : groupInfo?.group?.property?.projectName)?.charAt(0) || "G"}
                            </div>
                            <div style={styles.chatInfo}>
                                <h3 style={styles.chatTitleText}>
                                    {(isDealershipChat ? groupInfo?.group?.dealership?.name : groupInfo?.group?.property?.projectName) || "Group Chat"}
                                </h3>
                                <p style={styles.chatSubtitleText}>
                                    {groupInfo?.group?.members?.map(m => m.buyer?.name.split(' ')[0]).join(', ').slice(0, 30)}...
                                </p>
                            </div>
                        </div>
                        <div style={styles.chatHeaderRight}>
                            <button style={styles.iconButton}><Phone size={20} /></button>
                            <button style={styles.iconButton}><Video size={20} /></button>
                            <button style={styles.iconButton}><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={styles.messagesArea}>
                        {Object.keys(groupedMessages).map((date) => (
                            <div key={date}>
                                <div style={styles.dateDivider}>
                                    <span style={styles.dateBadge}>{date}</span>
                                </div>
                                {groupedMessages[date].map((msg) => {
                                    const isOwn = msg.sender._id === user._id;
                                    const isAdminMsg = msg.sender.role === "ADMIN";

                                    return (
                                        <div
                                            key={msg._id}
                                            style={{
                                                ...styles.messageRow,
                                                justifyContent: isOwn ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <div style={{
                                                ...styles.messageBubble,
                                                backgroundColor: isOwn ? '#10b981' : '#ffffff', // Green for own, White for others
                                                color: isOwn ? '#ffffff' : '#1f2937',
                                                borderTopLeftRadius: !isOwn ? 0 : 16,
                                                borderTopRightRadius: isOwn ? 0 : 16,
                                            }}>
                                                {!isOwn && (
                                                    <div style={{
                                                        ...styles.senderName,
                                                        color: isAdminMsg ? '#10b981' : '#f59e0b'
                                                    }}>
                                                        {isAdminMsg ? "Admin" : msg.sender.name}
                                                    </div>
                                                )}
                                                <div style={styles.messageContent}>
                                                    {msg.message}
                                                </div>
                                                <div style={{
                                                    ...styles.messageMeta,
                                                    color: isOwn ? 'rgba(255,255,255,0.7)' : '#9ca3af'
                                                }}>
                                                    {formatTime(msg.createdAt)}
                                                    {isOwn && <CheckCheck size={14} style={{ marginLeft: 4 }} />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} style={styles.inputArea}>
                        <div style={styles.inputWrapper}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message"
                                style={styles.inputBox}
                                disabled={sending}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                ...styles.sendButton,
                                opacity: !newMessage.trim() || sending ? 0.5 : 1,
                                transform: sending ? 'scale(0.95)' : 'scale(1)'
                            }}
                            disabled={!newMessage.trim() || sending}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    layout: {
        height: "calc(100vh - 64px)", // Adjust based on navbar height
        backgroundColor: "#f3f4f6", // Light gray background
        display: "flex",
        justifyContent: "center",
        padding: "20px",
    },
    mainContainer: {
        width: "100%",
        maxWidth: "1400px",
        height: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        display: "flex",
        overflow: "hidden",
    },
    // Sidebar Styles
    sidebar: {
        width: "350px",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
    },
    sidebarHeader: {
        height: "70px",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
        gap: "12px",
    },
    sidebarTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#1f2937",
        margin: 0,
    },
    sidebarContent: {
        flex: 1,
        overflowY: "auto",
        padding: "24px",
    },
    groupHeader: {
        textAlign: "center",
        marginBottom: "24px",
    },
    groupImagePlaceholder: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#d1fae5",
        color: "#10b981",
        fontSize: "32px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
    },
    groupName: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
        marginBottom: "4px",
    },
    groupBuilder: {
        fontSize: "14px",
        color: "#6b7280",
    },
    sectionDivider: {
        height: "1px",
        backgroundColor: "#f3f4f6",
        margin: "24px 0",
    },
    membersSection: {
        display: "flex",
        flexDirection: "column",
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#4b5563",
    },
    memberCount: {
        backgroundColor: "#f3f4f6",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#6b7280",
    },
    membersList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    memberItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px",
        borderRadius: "12px",
        transition: "background-color 0.2s",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#f9fafb",
        }
    },
    memberAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#f3f4f6",
        color: "#4b5563",
        fontSize: "16px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    memberDetails: {
        flex: 1,
    },
    memberName: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "2px",
    },
    youTag: {
        color: "#10b981",
        fontWeight: "500",
    },
    memberStatus: {
        fontSize: "12px",
        color: "#6b7280",
    },
    adminBadge: {
        fontSize: "10px",
        fontWeight: "600",
        color: "#059669",
        backgroundColor: "#d1fae5",
        padding: "2px 6px",
        borderRadius: "4px",
    },

    // Chat Window Styles
    chatWindow: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e5ddd5", // Classic chat background color
        position: "relative",
    },
    chatHeader: {
        height: "70px",
        padding: "0 24px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
    },
    chatHeaderLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    chatAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#d1fae5",
        color: "#10b981",
        fontSize: "18px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    chatInfo: {
        display: "flex",
        flexDirection: "column",
    },
    chatTitleText: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#111827",
        margin: 0,
    },
    chatSubtitleText: {
        fontSize: "13px",
        color: "#6b7280",
        margin: "2px 0 0 0",
    },
    chatHeaderRight: {
        display: "flex",
        gap: "16px",
        color: "#6b7280",
    },
    iconButton: {
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s",
        ":hover": {
            backgroundColor: "#f3f4f6",
        }
    },
    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // WhatsApp-like pattern
        backgroundSize: "400px",
    },
    dateDivider: {
        textAlign: "center",
        margin: "24px 0",
    },
    dateBadge: {
        backgroundColor: "#ffffff",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#6b7280",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    messageRow: {
        display: "flex",
        marginBottom: "4px",
    },
    messageBubble: {
        maxWidth: "60%",
        padding: "8px 12px",
        borderRadius: "16px",
        position: "relative",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        minWidth: "100px",
    },
    senderName: {
        fontSize: "12px",
        fontWeight: "700",
        marginBottom: "4px",
    },
    messageContent: {
        fontSize: "15px",
        lineHeight: "1.5",
        wordBreak: "break-word",
    },
    messageMeta: {
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: "4px",
    },
    inputArea: {
        padding: "16px 24px",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderTop: "1px solid #e5e7eb",
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
    },
    inputBox: {
        width: "100%",
        border: "none",
        outline: "none",
        fontSize: "15px",
        color: "#1f2937",
    },
    sendButton: {
        width: "48px",
        height: "48px",
        backgroundColor: "#10b981",
        color: "#ffffff",
        border: "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    // Loading/Error states
    loadingContainer: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "#6b7280",
    },
    spinner: {
        width: "32px",
        height: "32px",
        border: "3px solid #f3f4f6",
        borderTop: "3px solid #10b981",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    errorContainer: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    errorBox: {
        textAlign: "center",
        padding: "32px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    errorText: {
        color: "#ef4444",
        marginBottom: "16px",
    },
    backBtn: {
        padding: "8px 16px",
        backgroundColor: "#f3f4f6",
        border: "none",
        borderRadius: "8px",
        color: "#4b5563",
        fontWeight: "600",
        cursor: "pointer",
    }
};

export default GroupChat;
