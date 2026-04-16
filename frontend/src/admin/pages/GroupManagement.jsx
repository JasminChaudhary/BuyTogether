import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";
import StatusBadge from "../../common/components/StatusBadge";
import { FaUsers, FaComments, FaCheckCircle, FaTimesCircle, FaEye, FaCommentDots, FaBuilding, FaFilter, FaCar } from "react-icons/fa";

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [groupType, setGroupType] = useState('property');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [viewingGroup, setViewingGroup] = useState(null);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCities();
        fetchGroups("", groupType);
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get("/cities");
            setCities(response.data);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    const fetchGroups = async (cityId, type = groupType) => {
        setLoading(true);
        setError("");
        try {
            let endpoint;
            if (!cityId) {
                endpoint = type === 'property' ? '/property-groups' : '/dealership-groups';
            } else {
                endpoint = type === 'property'
                    ? `/property-groups/city/${cityId}`
                    : `/dealership-groups/city/${cityId}`;
            }
            const response = await api.get(endpoint);
            setGroups(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch groups");
        } finally {
            setLoading(false);
        }
    };

    const handleCityChange = (cityId) => {
        setSelectedCity(cityId);
        fetchGroups(cityId, groupType);
    };

    const handleTypeChange = (type) => {
        setGroupType(type);
        fetchGroups(selectedCity, type);
    };

    const handleEnableChat = async (groupId) => {
        if (!window.confirm("Enable chat for this group?")) return;

        try {
            const endpoint = groupType === 'property'
                ? `/property-groups/${groupId}/enable-chat`
                : `/dealership-groups/${groupId}/enable-chat`;
            await api.patch(endpoint);
            fetchGroups(selectedCity, groupType);
            alert("Chat enabled successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to enable chat");
        }
    };

    const handleDissolveGroup = async (groupId) => {
        if (!window.confirm("Dissolve this group? All tokens will be refunded.")) return;

        try {
            const endpoint = groupType === 'property'
                ? `/property-groups/${groupId}/dissolve`
                : `/dealership-groups/${groupId}/dissolve`;
            await api.patch(endpoint);
            fetchGroups(selectedCity, groupType);
            alert("Group dissolved successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to dissolve group");
        }
    };

    const handleMarkSuccessful = async (groupId) => {
        if (!window.confirm("Mark this group as successful? Tokens will be forfeited as platform fees.")) return;

        try {
            const endpoint = groupType === 'property'
                ? `/property-groups/${groupId}/mark-successful`
                : `/dealership-groups/${groupId}/mark-successful`;
            await api.patch(endpoint);
            fetchGroups(selectedCity, groupType);
            alert("Group marked as successful!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark group as successful");
        }
    };

    const handleViewMembers = (group) => {
        setViewingGroup(group);
        setShowMembersModal(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <FaUsers className="text-3xl text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Group Management</h1>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => handleTypeChange('property')}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${groupType === 'property' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <FaBuilding /> Properties
                        </button>
                        <button
                            onClick={() => handleTypeChange('dealership')}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${groupType === 'dealership' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <FaCar /> Dealerships
                        </button>
                    </div>
                </div>

                {/* City Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                    <FaFilter className="text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by City:</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                                {city.name}, {city.state}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                {!loading && groups.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Groups Found</h3>
                        <p className="text-gray-500">
                            {selectedCity
                                ? `There are no ${groupType} groups created in this city yet.`
                                : `There are no ${groupType} groups created yet.`}
                        </p>
                    </div>
                )}

                {!selectedCity && !loading && groups.length > 0 && (
                    <div className="text-center pb-8">
                        <p className="text-gray-500 bg-blue-50 py-2 rounded-lg border border-blue-100 inline-block px-4">
                            Showing all {groupType} groups across all cities
                        </p>
                    </div>
                )}

                {!loading && groups.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => {
                            const item = groupType === 'property' ? group.property : group.dealership;
                            if (!item) return null;
                            const title = groupType === 'property' ? item.projectName : item.name;
                            const subtitle = groupType === 'property' ? item.builderName : item.brand;
                            const location = groupType === 'property' ? item.location : item.address;

                            const canEnableChat = group.status === "QUALIFIED";
                            const canDissolve = group.status !== "SUCCESSFUL" && group.status !== "DISSOLVED";
                            const canMarkSuccessful = group.status === "QUALIFIED" || group.status === "CHAT_ENABLED";

                            return (
                                <div key={group._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={title}>{title}</h3>
                                            <p className="text-sm text-gray-500">{subtitle}</p>
                                        </div>
                                        <StatusBadge status={group.status} />
                                    </div>

                                    <div className="p-5 space-y-3 flex-grow">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Location</span>
                                            <span className="font-medium text-gray-900">{location}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-medium text-blue-600">
                                                {group.memberCount || 0} / {item.minimumGroupSize || 5} Members
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(((group.memberCount || 0) / (item.minimumGroupSize || 5)) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-gray-500">Deadline</span>
                                            <span className="font-medium text-gray-900">{formatDate(item.groupJoiningDeadline)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Created</span>
                                            <span className="font-medium text-gray-900">{formatDate(group.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                                        <button
                                            onClick={() => handleViewMembers(group)}
                                            className="w-full flex justify-center items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <FaEye className="mr-2" /> View Members
                                        </button>

                                        <div className="flex gap-2">
                                            {canEnableChat ? (
                                                <button
                                                    onClick={() => handleEnableChat(group._id)}
                                                    className="flex-1 flex justify-center items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                                >
                                                    <FaComments className="mr-2" /> Enable Chat
                                                </button>
                                            ) : (group.status === "CHAT_ENABLED" || group.status === "SUCCESSFUL") ? (
                                                <button
                                                    onClick={() => navigate(groupType === 'property' ? `/admin/groups/${group._id}/chat` : `/admin/dealership-groups/${group._id}/chat`)}
                                                    className="flex-1 flex justify-center items-center px-4 py-2 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                                >
                                                    <FaCommentDots className="mr-2" /> Join Chat
                                                </button>
                                            ) : null}

                                            {canMarkSuccessful && (
                                                <button
                                                    onClick={() => handleMarkSuccessful(group._id)}
                                                    className="flex-1 flex justify-center items-center px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                                                    title="Mark as Successful"
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                            )}

                                            {canDissolve && (
                                                <button
                                                    onClick={() => handleDissolveGroup(group._id)}
                                                    className="flex-1 flex justify-center items-center px-4 py-2 bg-red-100 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-200 transition-colors"
                                                    title="Dissolve Group"
                                                >
                                                    <FaTimesCircle />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Members Modal */}
                {showMembersModal && viewingGroup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMembersModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Group Members</h2>
                                    <p className="text-sm text-gray-500">
                                        {groupType === 'property' ? viewingGroup.property?.projectName : viewingGroup.dealership?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowMembersModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {viewingGroup.members?.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">No members have joined this group yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {viewingGroup.members?.map((member) => (
                                                    <tr key={member._id} className="hover:bg-gray-50">
                                                        <td className="py-3 font-medium text-gray-900">{member.buyer?.name}</td>
                                                        <td className="py-3 text-gray-600">{member.buyer?.email}</td>
                                                        <td className="py-3 text-gray-500">{formatDate(member.joinedAt)}</td>
                                                        <td className="py-3">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                                {member.tokenStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManagement;
