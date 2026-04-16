import React, { useState, useEffect, useCallback } from "react";
import api from "../../common/api";
import { FaBuilding, FaPlus, FaMapMarkerAlt, FaPhone, FaTrash, FaFilter, FaChevronDown, FaChevronUp, FaCar, FaImage, FaSearch, FaTimes, FaEdit, FaInfoCircle, FaUser, FaUsers } from "react-icons/fa";
import MapComponent from "../../common/components/MapComponent";
import { API_BASE_URL } from "../../common/config";

const DealershipManagement = () => {
    const [dealerships, setDealerships] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDealership, setEditingDealership] = useState(null);
    const [selectedDealership, setSelectedDealership] = useState(null); // For View Details Modal
    const [imageViewer, setImageViewer] = useState(null); // For Fullscreen Image Viewer
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const initialFormState = {
        name: "",
        brand: "",
        city: "",
        address: "",
        contactPerson: "",
        contactPhone: "",
        lat: "",
        lng: "",
        minimumGroupSize: "",
        tokenAmount: "",
        groupJoiningDeadline: "",
        groupRules: "",
        images: []
    };

    const [formData, setFormData] = useState(initialFormState);
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchCities();
        fetchDealerships();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get("/cities");
            setCities(response.data);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    const fetchDealerships = async (cityFilter = "") => {
        setLoading(true);
        setError("");
        try {
            const url = cityFilter ? `/dealerships?city=${cityFilter}` : "/dealerships";
            const response = await api.get(url);
            setDealerships(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch dealerships");
        } finally {
            setLoading(false);
        }
    };

    const handleCityFilter = (cityId) => {
        setSelectedCity(cityId);
        fetchDealerships(cityId);
    };

    // Geocoding function
    const handleGeocode = async () => {
        if (!formData.address || !formData.city) {
            alert("Please enter an address and select a city first.");
            return;
        }

        const cityObj = cities.find(c => c._id === formData.city);
        const cityName = cityObj ? cityObj.name : "";
        const query = `${formData.address}, ${cityName}`;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setFormData(prev => ({
                    ...prev,
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                }));
            } else {
                alert("Location not found on map. Please try a different query or set the marker manually.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Failed to fetch location coordinates.");
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'images') {
            setFormData({ ...formData, images: e.target.files });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.name || !formData.brand || !formData.city || !formData.address || !formData.contactPerson || !formData.contactPhone) {
            setFormError("All required fields must be filled");
            setFormLoading(false);
            return;
        }

        try {
            const data = new FormData();

            // Handle coordinates
            const coordinates = (formData.lat && formData.lng) ? JSON.stringify({
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng)
            }) : null;

            if (coordinates) {
                data.append('coordinates', coordinates);
            }

            Object.keys(formData).forEach(key => {
                if (key === 'images') {
                    if (formData.images && formData.images.length > 0) {
                        for (let i = 0; i < formData.images.length; i++) {
                            data.append('images', formData.images[i]);
                        }
                    }
                } else if (key !== 'lat' && key !== 'lng') {
                    // Don't append empty group fields if they aren't provided
                    if (['minimumGroupSize', 'tokenAmount', 'groupJoiningDeadline', 'groupRules'].includes(key)) {
                        if (formData[key]) {
                            data.append(key, formData[key]);
                        }
                    } else {
                        data.append(key, formData[key]);
                    }
                }
            });

            if (editingDealership) {
                await api.put(`/dealerships/${editingDealership._id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setShowEditModal(false);
                setEditingDealership(null);
            } else {
                await api.post("/dealerships", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setShowAddForm(false);
            }

            setFormData(initialFormState);
            fetchDealerships(selectedCity);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to save dealership");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (dealership) => {
        setEditingDealership(dealership);
        setFormData({
            name: dealership.name,
            brand: dealership.brand,
            city: dealership.city._id,
            address: dealership.address,
            contactPerson: dealership.contactPerson,
            contactPhone: dealership.contactPhone,
            lat: dealership.coordinates?.lat || "",
            lng: dealership.coordinates?.lng || "",
            minimumGroupSize: dealership.minimumGroupSize || "",
            tokenAmount: dealership.tokenAmount || "",
            groupJoiningDeadline: dealership.groupJoiningDeadline ? dealership.groupJoiningDeadline.split('T')[0] : "",
            groupRules: dealership.groupRules || "",
            images: [],
        });
        setShowEditModal(true);
        setSelectedDealership(null);
    };

    const handleDeleteImage = async (imagePath) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const response = await api.delete(`/dealerships/${editingDealership._id}/images`, {
                data: { imagePath }
            });

            // Update local state
            setEditingDealership(response.data);
            setDealerships(dealerships.map(p => p._id === response.data._id ? response.data : p));
        } catch (err) {
            console.error("Failed to delete image:", err);
            alert("Failed to delete image");
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/dealerships/${id}/toggle`);
            setDealerships(dealerships.map(d => d._id === id ? { ...d, isActive: !d.isActive } : d));
            if (selectedDealership && selectedDealership._id === id) {
                setSelectedDealership(prev => ({ ...prev, isActive: !prev.isActive }));
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to toggle dealership status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this dealership?")) {
            return;
        }
        try {
            await api.delete(`/dealerships/${id}`);
            setDealerships(dealerships.filter(d => d._id !== id));
            if (selectedDealership && selectedDealership._id === id) {
                setSelectedDealership(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete dealership");
        }
    };

    const openDetails = (dealership) => {
        setSelectedDealership(dealership);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <FaBuilding className="text-3xl text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Dealership Management</h1>
                </div>

                {/* City Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                    <FaFilter className="text-gray-400" />
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by City:</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => handleCityFilter(e.target.value)}
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

                {/* Add Dealership Form - Collapsible */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => { setShowAddForm(!showAddForm); setFormData(initialFormState); setEditingDealership(null); }}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <h2 className="text-xl font-semibold flex items-center text-gray-800">
                            <FaPlus className="mr-2 text-blue-500" /> Add New Dealership
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
                                {/* Reusable Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Dealership Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Galaxy Toyota" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Brand *</label>
                                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Toyota" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City *</label>
                                        <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select City</option>
                                            {cities.filter(c => c.isActive).map((city) => (
                                                <option key={city._id} value={city._id}>{city.name}, {city.state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Address *</label>
                                        <div className="flex gap-2">
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full showroom address" />
                                            <button type="button" onClick={handleGeocode} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1" title="Locate on Map">
                                                <FaSearch /> <span className="hidden sm:inline">Locate</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Person *</label>
                                        <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Manager Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Phone *</label>
                                        <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phone Number" />
                                    </div>

                                    {/* Group Buying Settings */}
                                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <FaUsers className="mr-2 text-blue-500" /> Group Buying Settings (Optional)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Minimum Group Size</label>
                                                <input type="number" name="minimumGroupSize" value={formData.minimumGroupSize} onChange={handleChange} min="2" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Token Amount (₹)</label>
                                                <input type="number" name="tokenAmount" value={formData.tokenAmount} onChange={handleChange} min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 10000" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Joining Deadline</label>
                                                <input type="date" name="groupJoiningDeadline" value={formData.groupJoiningDeadline} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="col-span-1 md:col-span-3 space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Group Rules</label>
                                                <textarea name="groupRules" value={formData.groupRules} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Any specific rules for the group buying process..."></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Dealership Images</label>
                                        <input type="file" name="images" onChange={handleChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>
                                </div>

                                {/* Map Section */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex justify-between">
                                        <span>Map Location (Click or drag marker to adjust)</span>
                                        <span className="text-xs text-gray-500">Lat: {formData.lat || 'N/A'}, Lng: {formData.lng || 'N/A'}</span>
                                    </label>
                                    <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-gray-200 z-0 shadow-sm">
                                        <MapComponent
                                            center={formData.lat && formData.lng ? [parseFloat(formData.lat), parseFloat(formData.lng)] : [20.5937, 78.9629]}
                                            zoom={formData.lat ? 15 : 5}
                                            height="300px"
                                            marker={formData.lat && formData.lng ? [parseFloat(formData.lat), parseFloat(formData.lng)] : null}
                                            draggable={true}
                                            onClick={(latlng) => {
                                                setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng });
                                            }}
                                            onMarkerDragEnd={(latlng) => {
                                                setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng });
                                            }}
                                            showControls={true}
                                        />
                                    </div>
                                </div>

                                {formError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{formError}</p>}

                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">Cancel</button>
                                    <button type="submit" disabled={formLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50">{formLoading ? "Adding..." : "Add Dealership"}</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Edit Modal (reusing form logic mostly) */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-gray-900">Edit Dealership</h2>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Duplicate form content for now to ensure isolation, or extract to component ideally. For brevity, pasting key fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Dealership Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Brand *</label>
                                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City *</label>
                                        <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select City</option>
                                            {cities.filter(c => c.isActive).map((city) => (
                                                <option key={city._id} value={city._id}>{city.name}, {city.state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Address *</label>
                                        <div className="flex gap-2">
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <button type="button" onClick={handleGeocode} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                                                <FaSearch /> <span className="hidden sm:inline">Locate</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Person *</label>
                                        <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Phone *</label>
                                        <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>

                                    {/* Group Buying Settings */}
                                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <FaUsers className="mr-2 text-blue-500" /> Group Buying Settings
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Minimum Group Size</label>
                                                <input type="number" name="minimumGroupSize" value={formData.minimumGroupSize} onChange={handleChange} min="2" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Token Amount (₹)</label>
                                                <input type="number" name="tokenAmount" value={formData.tokenAmount} onChange={handleChange} min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Joining Deadline</label>
                                                <input type="date" name="groupJoiningDeadline" value={formData.groupJoiningDeadline} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div className="col-span-1 md:col-span-3 space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Group Rules</label>
                                                <textarea name="groupRules" value={formData.groupRules} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Existing Images Section */}
                                {editingDealership.images && editingDealership.images.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Existing Images</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {editingDealership.images.map((img, idx) => (
                                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 h-24">
                                                    <img src={`${API_BASE_URL}/${img.replace(/\\/g, '/')}`} alt={`Dealership ${idx}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => handleDeleteImage(img)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">New Images</label>
                                    <input type="file" name="images" onChange={handleChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex justify-between">
                                        <span>Map Location</span>
                                        <span className="text-xs text-gray-500">Lat: {formData.lat || 'N/A'}, Lng: {formData.lng || 'N/A'}</span>
                                    </label>
                                    <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-gray-200 z-0 shadow-sm">
                                        <MapComponent
                                            center={formData.lat && formData.lng ? [parseFloat(formData.lat), parseFloat(formData.lng)] : [20.5937, 78.9629]}
                                            zoom={formData.lat ? 15 : 5}
                                            height="300px"
                                            marker={formData.lat && formData.lng ? [parseFloat(formData.lat), parseFloat(formData.lng)] : null}
                                            draggable={true}
                                            onClick={(latlng) => setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng })}
                                            onMarkerDragEnd={(latlng) => setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng })}
                                            showControls={true}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">Cancel</button>
                                    <button type="submit" disabled={formLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50">{formLoading ? "Updating..." : "Update Dealership"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Dealerships List - Card Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">
                        {selectedCity ? "Filtered Dealerships" : "All Dealerships"}
                    </h2>

                    {!loading && dealerships.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dealerships.map((dealership) => (
                                <div key={dealership._id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer" onClick={() => openDetails(dealership)}>
                                    {/* Card Image */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {dealership.images && dealership.images.length > 0 ? (
                                            <img src={`${API_BASE_URL}/${dealership.images[0].replace(/\\/g, '/')}`} alt={dealership.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaCar size={40} />
                                            </div>
                                        )}

                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${dealership.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {dealership.isActive ? "ACTIVE" : "INACTIVE"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">{dealership.name}</h3>
                                        <div className="flex items-start text-sm text-gray-600 mb-3">
                                            <FaMapMarkerAlt className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                                            <span>{dealership.city?.name}</span>
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{dealership.address || "No address provided."}</p>

                                        <div className="flex items-center text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                                            <FaPhone className="mr-2 text-gray-400" />
                                            {dealership.contactPerson} ({dealership.contactPhone})
                                        </div>

                                        <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleToggle(dealership._id)} className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${dealership.isActive ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"}`}>
                                                {dealership.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button onClick={() => handleEdit(dealership)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200" title="Edit Dealership">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(dealership._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200" title="Delete Dealership">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Modal */}
                {selectedDealership && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedDealership(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedDealership.name}</h2>
                                    <p className="text-gray-500 font-medium">Authorized {selectedDealership.brand} Dealership</p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setSelectedDealership(null)}>
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Images Grid */}
                                {selectedDealership.images && selectedDealership.images.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <FaImage className="text-blue-500" /> Gallery
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedDealership.images.map((img, idx) => (
                                                <div key={idx} className="rounded-xl overflow-hidden shadow-sm border border-gray-100 h-32 md:h-40 group cursor-pointer" onClick={() => setImageViewer(img)}>
                                                    <img
                                                        src={`${API_BASE_URL}/${img.replace(/\\/g, '/')}`}
                                                        alt={`Dealership ${idx}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Contact Details</h3>

                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500 mt-1"><FaMapMarkerAlt /></div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Address</p>
                                                    <p className="text-gray-900 font-medium">{selectedDealership.address}</p>
                                                    <p className="text-gray-500 text-sm">{selectedDealership.city?.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500 mt-1"><FaUser /></div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Contact Person</p>
                                                    <p className="text-gray-900 font-medium">{selectedDealership.contactPerson}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500 mt-1"><FaPhone /></div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone</p>
                                                    <p className="text-blue-600 font-bold text-lg">{selectedDealership.contactPhone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedDealership.minimumGroupSize && (
                                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 space-y-4">
                                                <h3 className="text-lg font-bold text-blue-900 border-b border-blue-200 pb-2 flex items-center">
                                                    <FaUsers className="mr-2" /> Group Details
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Min Group Size</p>
                                                        <p className="text-gray-900 font-medium">{selectedDealership.minimumGroupSize} Members</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Token Amount</p>
                                                        <p className="text-gray-900 font-medium">₹{selectedDealership.tokenAmount?.toLocaleString('en-IN') || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Joining Deadline</p>
                                                    <p className="text-gray-900 font-medium">
                                                        {selectedDealership.groupJoiningDeadline ? new Date(selectedDealership.groupJoiningDeadline).toLocaleDateString('en-IN') : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedDealership.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                                Status: {selectedDealership.isActive ? "ACTIVE" : "INACTIVE"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Map Section */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-blue-500" /> Location
                                        </h3>
                                        <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                                            {selectedDealership.coordinates && selectedDealership.coordinates.lat ? (
                                                <MapComponent
                                                    center={[selectedDealership.coordinates.lat, selectedDealership.coordinates.lng]}
                                                    zoom={15}
                                                    height="300px"
                                                    marker={[selectedDealership.coordinates.lat, selectedDealership.coordinates.lng]}
                                                    showControls={true}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                    Location data not available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Image Viewer (Reuse from PropertyManagement logic if needed, simplify here) */}
                {imageViewer && (
                    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setImageViewer(null)}>
                        <img src={`${API_BASE_URL}/${imageViewer.replace(/\\/g, '/')}`} className="max-w-full max-h-full rounded-lg" />
                    </div>
                )}

            </div>
        </div>
    );
};

export default DealershipManagement;
