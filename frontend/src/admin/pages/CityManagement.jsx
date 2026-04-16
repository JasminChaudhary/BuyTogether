import React, { useState, useEffect } from "react";
import api from "../../common/api";
import { FaCity, FaPlus, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";

const CityManagement = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ name: "", state: "" });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/cities");
            setCities(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch cities");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.name.trim() || !formData.state.trim()) {
            setFormError("Both name and state are required");
            setFormLoading(false);
            return;
        }

        try {
            await api.post("/cities", formData);
            setFormData({ name: "", state: "" });
            setShowAddForm(false);
            fetchCities();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to create city");
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/cities/${id}/toggle`);
            fetchCities();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to toggle city status");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <FaCity className="text-3xl text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">City Management</h1>
                </div>

                {/* Add City Form - Collapsible */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <h2 className="text-xl font-semibold flex items-center text-gray-800">
                            <FaPlus className="mr-2 text-blue-500" /> Add New City
                        </h2>
                        {showAddForm ? (
                            <FaChevronUp className="text-gray-400" />
                        ) : (
                            <FaChevronDown className="text-gray-400" />
                        )}
                    </button>

                    {showAddForm && (
                        <div className="px-6 pb-6 border-t border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="e.g. Maharashtra"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {formError && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                        {formError}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className={`px-6 py-2 rounded-lg font-medium text-white shadow-sm transition-all ${formLoading
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
                                            }`}
                                    >
                                        {formLoading ? "Adding..." : "Add City"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Cities List - Card Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">All Cities</h2>

                    {loading && (
                        <div className="text-center py-12 text-gray-500 animate-pulse">
                            Loading cities...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {!loading && cities.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No cities found. Add one above to get started.</p>
                        </div>
                    )}

                    {!loading && cities.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cities.map((city) => (
                                <div
                                    key={city._id}
                                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                                >
                                    {/* City Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-blue-500 text-sm" />
                                                {city.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{city.state}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs font-bold rounded-full ${city.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {city.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleToggle(city._id)}
                                        className={`w-full py-2 rounded-lg font-medium transition-colors text-sm ${city.isActive
                                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                                            }`}
                                    >
                                        {city.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CityManagement;
