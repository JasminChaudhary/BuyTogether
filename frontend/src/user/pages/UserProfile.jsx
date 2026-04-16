import React, { useState, useEffect } from "react";
import api from "../../common/api";
import CitySelectionModal from "../components/CitySelectionModal";
import { Camera, MapPin, Mail, Phone, User, LogOut, Shield, Calendar, Building2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL , getImageUrl } from "../../common/config";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCityModal, setShowCityModal] = useState(false);
    const [stats, setStats] = useState({
        groupsJoined: 0,
        activeGroups: 0,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch User Profile from API
                const profileResponse = await api.get("/user/profile");
                const userData = profileResponse.data;

                // Update localStorage with fresh data
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);

                // Fetch User Stats (Groups Joined)
                const groupsResponse = await api.get("/group-members/my-groups");
                const groups = groupsResponse.data;

                const active = groups.filter(g => g.group?.status !== "DISSOLVED" && g.group?.status !== "SUCCESSFUL");

                setStats({
                    groupsJoined: groups.length,
                    activeGroups: active.length,
                });

            } catch (err) {
                // Silent error or toast? Usually keep silent on load unless critical, but toast is okay.
                // toast.error("Failed to load profile data."); 
                // Fallback to localStorage if API fails
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (storedUser && storedUser.name) {
                    setUser(storedUser);
                } else {
                    toast.error("Could not load user profile.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            await api.post("/user/profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Re-fetch profile
            const response = await api.get("/user/profile");

            // Update local storage
            const updatedUser = { ...user, profilePicture: response.data.profilePicture };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            toast.success("Profile picture updated successfully!");

            // Force reload to update Navbar (react context would be better but simple reload works)
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err) {
            toast.error("Failed to upload image. Please try again.");
        }
    };

    const handleCitySelect = (city) => {
        // Update localStorage
        localStorage.setItem("selectedCity", JSON.stringify(city));

        // Update user state
        const updatedUser = { ...user, selectedCity: city };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setShowCityModal(false);
        toast.success(`City updated to ${city.name}, ${city.state}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return <div className="text-center text-red-500 p-10">User not found. Please log in.</div>;
    }

    // Get Initials
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : "U";

    const joinYear = new Date(user.createdAt || Date.now()).getFullYear();

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
            <CitySelectionModal
                isOpen={showCityModal}
                onClose={() => setShowCityModal(false)}
                onCitySelect={handleCitySelect}
            />

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Cover Banner */}
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
                    <div className="absolute inset-0 bg-white/10 pattern-dots"></div>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex flex-col md:flex-row justify-between items-end md:items-end -mt-12 mb-6 gap-4">
                        <div className="flex items-end gap-6">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                                    {user.profilePicture ? (
                                        <img
                                            src={getImageUrl(user.profilePicture)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <label
                                    htmlFor="file-upload"
                                    className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 hover:text-emerald-600 text-gray-500 transition-all duration-200 transform hover:scale-105"
                                    title="Change Profile Picture"
                                >
                                    <Camera size={18} />
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="pb-2">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1.5">
                                    <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium text-gray-700">
                                        <Shield size={14} className="text-emerald-600" />
                                        {user.role}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        Member since {joinYear}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <User size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.groupsJoined}</div>
                                <div className="text-sm text-gray-500 font-medium">Groups Joined</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.activeGroups}</div>
                                <div className="text-sm text-gray-500 font-medium">Active Groups</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">₹0</div>
                                <div className="text-sm text-gray-500 font-medium">Total Savings</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Details Section */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Contact Info */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <User size={20} className="text-emerald-600" />
                            Personal Information
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
                                Full Name
                            </label>
                            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium text-sm flex items-center justify-between group hover:border-gray-300 transition-colors">
                                {user.name}
                                <User size={16} className="text-gray-400 group-hover:text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
                                <Mail size={14} /> Email Address
                            </label>
                            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium text-sm flex items-center justify-between group hover:border-gray-300 transition-colors">
                                {user.email}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
                                <Phone size={14} /> Phone Number
                            </label>
                            <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium text-sm flex items-center justify-between group hover:border-gray-300 transition-colors">
                                {user.phone || "Not provided"}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
                                <MapPin size={14} /> Location Preference
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium text-sm truncate">
                                    {user.selectedCity ? `${user.selectedCity.name}, ${user.selectedCity.state}` : "No city selected"}
                                </div>
                                <button
                                    onClick={() => setShowCityModal(true)}
                                    className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Account Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Shield size={20} className="text-emerald-600" />
                        Account Actions
                    </h2>

                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group text-left">
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">Change Password</div>
                                <div className="text-xs text-gray-500">Update your security credentials</div>
                            </div>
                            <span className="text-gray-400 group-hover:text-emerald-600">→</span>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group text-left">
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">Notification Settings</div>
                                <div className="text-xs text-gray-500">Manage your alerts</div>
                            </div>
                            <span className="text-gray-400 group-hover:text-emerald-600">→</span>
                        </button>

                        <div className="pt-6 mt-6 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    window.location.href = "/login";
                                }}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
