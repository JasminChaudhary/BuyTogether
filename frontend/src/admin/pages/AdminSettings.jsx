import React, { useState, useEffect } from "react";
import { FaCog, FaPalette, FaEnvelope, FaDollarSign, FaLock, FaChartBar, FaSave, FaUser } from "react-icons/fa";
import api from "../../common/api";

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalDealerships: 0,
        totalGroups: 0,
        activeCities: 0,
    });
    const [settings, setSettings] = useState({
        // Platform Settings
        siteName: "BuyTogether",
        contactEmail: "admin@buytogether.com",
        contactPhone: "+91 1234567890",
        platformFee: "5",

        // Appearance Settings
        primaryColor: "#2563eb",
        logoUrl: "",

        // Email Settings
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: "",

        // Payment Settings
        tokenPrice: "100",
        paymentGateway: "razorpay",

        // Security Settings
        sessionTimeout: "30",
        passwordMinLength: "8",

        // Analytics Settings
        googleAnalyticsId: "",
        enableTracking: false,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const profileResponse = await api.get("/user/profile");
            const userData = profileResponse.data;
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);

            // Fetch stats
            const [propertiesRes, dealershipsRes, groupsRes, citiesRes] = await Promise.all([
                api.get("/properties"),
                api.get("/dealerships"),
                api.get("/property-groups"),
                api.get("/cities"),
            ]);

            setStats({
                totalProperties: propertiesRes.data?.length || 0,
                totalDealerships: dealershipsRes.data?.length || 0,
                totalGroups: groupsRes.data?.length || 0,
                activeCities: citiesRes.data?.filter(c => c.isActive)?.length || 0,
            });
        } catch (err) {
            console.error("Error loading profile:", err);
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (storedUser?.name) setUser(storedUser);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            await api.post("/user/profile-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const response = await api.get("/user/profile");
            const updatedUser = { ...user, profilePicture: response.data.profilePicture };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            window.location.reload();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload image.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSave = () => {
        // TODO: Implement API call to save settings
        alert("Settings saved successfully!");
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: FaUser },
        { id: "platform", label: "Platform", icon: FaCog },
        { id: "appearance", label: "Appearance", icon: FaPalette },
        { id: "email", label: "Email", icon: FaEnvelope },
        { id: "payment", label: "Payment", icon: FaDollarSign },
        { id: "security", label: "Security", icon: FaLock },
        { id: "analytics", label: "Analytics", icon: FaChartBar },
    ];

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : "A";

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <FaCog className="text-3xl text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-gray-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="text-lg" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === "profile" && user && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Profile</h2>

                                {/* Profile Header */}
                                <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
                                    <div className="relative mb-4">
                                        {user.profilePicture ? (
                                            <img
                                                src={`http://localhost:5000/${user.profilePicture}`}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
                                                {initials}
                                            </div>
                                        )}
                                        <label
                                            htmlFor="file-upload"
                                            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
                                        >
                                            📷
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                                    <span className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase">
                                        {user.role}
                                    </span>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Administrator since {new Date(user.createdAt).getFullYear()}
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{stats.totalGroups}</div>
                                        <div className="text-xs text-gray-600 mt-1">Total Groups</div>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">{stats.totalProperties}</div>
                                        <div className="text-xs text-gray-600 mt-1">Properties</div>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">{stats.totalDealerships}</div>
                                        <div className="text-xs text-gray-600 mt-1">Dealerships</div>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-orange-600">{stats.activeCities}</div>
                                        <div className="text-xs text-gray-600 mt-1">Active Cities</div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            disabled
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="text"
                                            value={user.phone || "Not provided"}
                                            disabled
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <input
                                            type="text"
                                            value={user.role}
                                            disabled
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Platform Settings */}
                        {activeTab === "platform" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Settings</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Site Name</label>
                                        <input
                                            type="text"
                                            name="siteName"
                                            value={settings.siteName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={settings.contactEmail}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={settings.contactPhone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Platform Fee (%)</label>
                                        <input
                                            type="number"
                                            name="platformFee"
                                            value={settings.platformFee}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === "appearance" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Appearance Settings</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="color"
                                                name="primaryColor"
                                                value={settings.primaryColor}
                                                onChange={handleChange}
                                                className="h-11 w-20 rounded-lg border border-gray-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={settings.primaryColor}
                                                readOnly
                                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                                        <input
                                            type="url"
                                            name="logoUrl"
                                            value={settings.logoUrl}
                                            onChange={handleChange}
                                            placeholder="https://example.com/logo.png"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Settings */}
                        {activeTab === "email" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Settings (SMTP)</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                                        <input
                                            type="text"
                                            name="smtpHost"
                                            value={settings.smtpHost}
                                            onChange={handleChange}
                                            placeholder="smtp.gmail.com"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                                        <input
                                            type="number"
                                            name="smtpPort"
                                            value={settings.smtpPort}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">SMTP Username</label>
                                        <input
                                            type="text"
                                            name="smtpUser"
                                            value={settings.smtpUser}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">SMTP Password</label>
                                        <input
                                            type="password"
                                            name="smtpPassword"
                                            value={settings.smtpPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === "payment" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Settings</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Token Price (₹)</label>
                                        <input
                                            type="number"
                                            name="tokenPrice"
                                            value={settings.tokenPrice}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Payment Gateway</label>
                                        <select
                                            name="paymentGateway"
                                            value={settings.paymentGateway}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        >
                                            <option value="razorpay">Razorpay</option>
                                            <option value="stripe">Stripe</option>
                                            <option value="paypal">PayPal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                                        <input
                                            type="number"
                                            name="sessionTimeout"
                                            value={settings.sessionTimeout}
                                            onChange={handleChange}
                                            min="5"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Minimum Password Length</label>
                                        <input
                                            type="number"
                                            name="passwordMinLength"
                                            value={settings.passwordMinLength}
                                            onChange={handleChange}
                                            min="6"
                                            max="20"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Analytics Settings */}
                        {activeTab === "analytics" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics Settings</h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
                                        <input
                                            type="text"
                                            name="googleAnalyticsId"
                                            value={settings.googleAnalyticsId}
                                            onChange={handleChange}
                                            placeholder="G-XXXXXXXXXX"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="enableTracking"
                                            checked={settings.enableTracking}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Enable User Tracking</label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                <FaSave />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
