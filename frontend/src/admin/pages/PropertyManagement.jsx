import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../../common/api";
import { FaBuilding, FaPlus, FaMapMarkerAlt, FaFilter, FaInfoCircle, FaUsers, FaRupeeSign, FaCalendarAlt, FaEdit, FaTrash, FaImage, FaFilePdf, FaTimes, FaSearch, FaMapPin } from "react-icons/fa";
import MapComponent from "../../common/components/MapComponent";

const PropertyManagement = () => {
    const [properties, setProperties] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [formData, setFormData] = useState({
        projectName: "",
        builderName: "",
        city: "",
        location: "",
        propertyType: "",
        minimumPrice: "",
        minimumGroupSize: "",
        groupJoiningDeadline: "",
        tokenAmount: "",
        groupRules: "",
        images: [],
        brochure: null,
        lat: "",
        lng: "",
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null); // For View Details Modal
    const [imageViewer, setImageViewer] = useState(null); // For Fullscreen Image Viewer
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // For Image Slider

    useEffect(() => {
        fetchCities();
        fetchProperties();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get("/cities");
            setCities(response.data);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    const fetchProperties = async (cityFilter = "") => {
        setLoading(true);
        setError("");
        try {
            const url = cityFilter ? `/properties?city=${cityFilter}` : "/properties";
            const response = await api.get(url);
            setProperties(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    };

    const handleCityFilter = (cityId) => {
        setSelectedCity(cityId);
        fetchProperties(cityId);
    };

    // Geocoding function
    const handleGeocode = async () => {
        if (!formData.location || !formData.city) {
            alert("Please enter a location and select a city first.");
            return;
        }

        const cityObj = cities.find(c => c._id === formData.city);
        const cityName = cityObj ? cityObj.name : "";
        const query = `${formData.location}, ${cityName}`;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.projectName || !formData.builderName || !formData.city || !formData.location || !formData.propertyType || !formData.minimumPrice || !formData.minimumGroupSize || !formData.groupJoiningDeadline || !formData.tokenAmount) {
            setFormError("All fields are required");
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
                    for (let i = 0; i < formData.images.length; i++) {
                        data.append('images', formData.images[i]);
                    }
                } else if (key === 'brochure') {
                    if (formData.brochure) data.append('brochure', formData.brochure);
                } else if (key !== 'lat' && key !== 'lng') {
                    data.append(key, formData[key]);
                }
            });

            await api.post("/properties", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormData({
                projectName: "",
                builderName: "",
                city: "",
                location: "",
                propertyType: "",
                minimumPrice: "",
                minimumGroupSize: "",
                groupJoiningDeadline: "",
                tokenAmount: "",
                groupRules: "",
                images: [],
                brochure: null,
                lat: "",
                lng: "",
            });
            fetchProperties(selectedCity);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to create property");
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/properties/${id}/toggle`);
            // Update local state immediately for better UX
            setProperties(properties.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p));
            if (selectedProperty && selectedProperty._id === id) {
                setSelectedProperty(prev => ({ ...prev, isActive: !prev.isActive }));
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to toggle property status");
            fetchProperties(selectedCity); // Revert on error
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) {
            return;
        }
        try {
            await api.delete(`/properties/${id}`);
            setProperties(properties.filter(p => p._id !== id));
            if (selectedProperty && selectedProperty._id === id) {
                setSelectedProperty(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete property");
            fetchProperties(selectedCity); // Revert on error
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            projectName: property.projectName,
            builderName: property.builderName,
            city: property.city._id,
            location: property.location,
            propertyType: property.propertyType,
            minimumPrice: property.minimumPrice,
            minimumGroupSize: property.minimumGroupSize,
            groupJoiningDeadline: property.groupJoiningDeadline.split('T')[0],
            tokenAmount: property.tokenAmount,
            groupRules: property.groupRules || "",
            images: [],
            brochure: null,
            lat: property.coordinates?.lat || "",
            lng: property.coordinates?.lng || "",
        });
        setShowEditModal(true);
        setSelectedProperty(null); // Close details modal if open
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

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
                } else if (key === 'brochure') {
                    if (formData.brochure instanceof File) data.append('brochure', formData.brochure);
                } else if (key !== 'lat' && key !== 'lng') {
                    data.append(key, formData[key]);
                }
            });

            await api.put(`/properties/${editingProperty._id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setShowEditModal(false);
            setEditingProperty(null);
            setFormData({
                projectName: "",
                builderName: "",
                city: "",
                location: "",
                propertyType: "",
                minimumPrice: "",
                minimumGroupSize: "",
                groupJoiningDeadline: "",
                tokenAmount: "",
                groupRules: "",
                images: [],
                brochure: null,
                lat: "",
                lng: "",
            });
            fetchProperties(selectedCity);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to update property");
        } finally {
            setFormLoading(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'images') {
            setFormData({ ...formData, images: e.target.files });
        } else if (e.target.name === 'brochure') {
            setFormData({ ...formData, brochure: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const formatPrice = (price) => {
        if (!price) return "₹0";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleDeleteImage = async (imagePath) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const response = await api.delete(`/properties/${editingProperty._id}/images`, {
                data: { imagePath }
            });

            // Update local state
            setEditingProperty(response.data);
            setProperties(properties.map(p => p._id === response.data._id ? response.data : p));
        } catch (err) {
            console.error("Failed to delete image:", err);
            alert("Failed to delete image");
        }
    };

    const handleDeleteBrochure = async () => {
        if (!window.confirm("Are you sure you want to delete the brochure?")) return;

        try {
            const response = await api.delete(`/properties/${editingProperty._id}/brochure`);

            // Update local state
            setEditingProperty(response.data);
            setProperties(properties.map(p => p._id === response.data._id ? response.data : p));
        } catch (err) {
            console.error("Failed to delete brochure:", err);
            alert("Failed to delete brochure");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <FaBuilding className="text-3xl text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
                    </div>
                </div>

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-gray-900">Edit Property</h2>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleUpdate} className="p-6 space-y-6">
                                {/* Form content reused below for add/edit consistency */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                                        <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Builder Name *</label>
                                        <input type="text" name="builderName" value={formData.builderName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
                                        <label className="block text-sm font-medium text-gray-700">Location *</label>
                                        <div className="flex gap-2">
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location/area" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <button
                                                type="button"
                                                onClick={handleGeocode}
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                title="Locate on Map"
                                            >
                                                <FaSearch /> <span className="hidden sm:inline">Locate</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="">Select Type</option>
                                            <option value="Flat">Flat</option>
                                            <option value="Villa">Villa</option>
                                            <option value="Plot">Plot</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Minimum Price (₹) *</label>
                                        <input type="number" name="minimumPrice" value={formData.minimumPrice} onChange={handleChange} min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>

                                {/* Map Section */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex justify-between">
                                        <span>Map Location (Click or drag marker to adjust)</span>
                                        <span className="text-xs text-gray-500">Lat: {formData.lat || 'N/A'}, Lng: {formData.lng || 'N/A'}</span>
                                    </label>
                                    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-200 z-0 shadow-sm">
                                        <MapComponent
                                            center={formData.lat && formData.lng ? [parseFloat(formData.lat), parseFloat(formData.lng)] : [20.5937, 78.9629]}
                                            zoom={formData.lat ? 15 : 5}
                                            height="400px"
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
                                    {/* Hidden or visible inputs for Lat/Lng if needed for manual adjustment */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitude" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" step="any" />
                                        <input type="number" name="lng" value={formData.lng} onChange={handleChange} placeholder="Longitude" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" step="any" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-2">Group Buying Settings</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Minimum Group Size *</label>
                                        <input type="number" name="minimumGroupSize" value={formData.minimumGroupSize} onChange={handleChange} min="1" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Group Joining Deadline *</label>
                                        <input type="date" name="groupJoiningDeadline" value={formData.groupJoiningDeadline} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Token Amount (₹) *</label>
                                        <input type="number" name="tokenAmount" value={formData.tokenAmount} onChange={handleChange} min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Group Rules (Optional)</label>
                                        <textarea name="groupRules" value={formData.groupRules} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" />
                                    </div>
                                </div>

                                {/* Existing Images Section */}
                                {editingProperty.images && editingProperty.images.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Existing Images</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {editingProperty.images.map((img, idx) => (
                                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 h-24">
                                                    <img
                                                        src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                                                        alt={`Property ${idx}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(img)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        title="Delete Image"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Existing Brochure Section */}
                                {editingProperty.brochure && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Current Brochure</label>
                                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaFilePdf className="text-red-500 text-xl" />
                                                <a
                                                    href={`http://localhost:5000/${editingProperty.brochure.replace(/\\/g, '/')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium text-blue-700 hover:underline"
                                                >
                                                    View Brochure PDF
                                                </a>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleDeleteBrochure}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Delete Brochure"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">New Images (Max 5)</label>
                                        <div className="flex items-center space-x-2">
                                            <FaImage className="text-gray-400" />
                                            <input type="file" name="images" onChange={handleChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">New Brochure (PDF)</label>
                                        <div className="flex items-center space-x-2">
                                            <FaFilePdf className="text-gray-400" />
                                            <input type="file" name="brochure" onChange={handleChange} accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                        </div>
                                    </div>
                                </div>

                                {formError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{formError}</p>}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">Cancel</button>
                                    <button type="submit" disabled={formLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50">{formLoading ? "Updating..." : "Update Property"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                {selectedProperty && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedProperty(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all" onClick={(e) => e.stopPropagation()}>
                            <div className="relative">
                                {/* Header / Hero Image Area if available, otherwise just header */}
                                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.projectName}</h2>
                                        <p className="text-gray-500 flex items-center mt-1">
                                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                            {selectedProperty.location}, {selectedProperty.city?.name}, {selectedProperty.city?.state}
                                        </p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 text-2xl p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setSelectedProperty(null)}>
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="p-6 md:p-8 space-y-8">

                                    {/* Images Section */}
                                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedProperty.images.map((img, idx) => (
                                                <div key={idx} className={`rounded-xl overflow-hidden shadow-sm border border-gray-100 h-40 ${idx === 0 ? "col-span-2 row-span-2 h-[21rem]" : ""}`}>
                                                    <img
                                                        src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                                                        alt={`Property ${idx}`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                                        onClick={() => setImageViewer(img)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl h-48 flex items-center justify-center border-2 border-dashed border-gray-200">
                                            <div className="text-center text-gray-400">
                                                <FaImage className="mx-auto text-4xl mb-2 opacity-50" />
                                                <p>No images available</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Key Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Price</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatPrice(selectedProperty.minimumPrice)}</p>
                                            <p className="text-sm text-gray-500 mt-1">Token: {formatPrice(selectedProperty.tokenAmount)}</p>
                                        </div>
                                        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                            <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-1">Group Status</p>
                                            <div className="flex items-center gap-2">
                                                <FaUsers className="text-xl text-purple-500" />
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {selectedProperty.currentGroup?.memberCount || 0}
                                                    <span className="text-base text-gray-400 font-normal"> / {selectedProperty.minimumGroupSize}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                                            <p className="text-sm text-orange-600 font-semibold uppercase tracking-wider mb-1">Timeline</p>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-xl text-orange-500" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{formatDate(selectedProperty.groupJoiningDeadline)}</p>
                                                    <p className="text-xs text-orange-600">Deadline</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Lists */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <FaBuilding className="text-gray-400" /> Project Details
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Builder</span>
                                                    <span className="font-medium text-gray-900">{selectedProperty.builderName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Property Type</span>
                                                    <span className="font-medium text-gray-900">{selectedProperty.propertyType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Status</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${selectedProperty.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                        {selectedProperty.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <FaFilePdf className="text-gray-400" /> Documents & Rules
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
                                                {selectedProperty.brochure ? (
                                                    <a
                                                        href={`http://localhost:5000/${selectedProperty.brochure.replace(/\\/g, '/')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                                                    >
                                                        <div className="bg-red-50 p-2 rounded text-red-500 group-hover:bg-red-100 transition-colors">
                                                            <FaFilePdf className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Download Brochure</p>
                                                            <p className="text-xs text-gray-500">PDF Document</p>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="text-sm text-gray-500 italic">No brochure uploaded</div>
                                                )}

                                                <div>
                                                    <span className="block text-sm font-medium text-gray-700 mb-1">Group Rules</span>
                                                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 min-h-[60px]">
                                                        {selectedProperty.groupRules || "No specific rules provided."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Section (Read Only) */}
                                {selectedProperty.coordinates && selectedProperty.coordinates.lat && selectedProperty.coordinates.lng && (
                                    <div className="space-y-4 mt-8">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-gray-400" /> Property Location
                                        </h3>
                                        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-200 z-0 shadow-sm">
                                            <MapComponent
                                                center={[selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]}
                                                zoom={15}
                                                height="400px"
                                                marker={[selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]}
                                                showControls={true}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl sticky bottom-0">
                                    <button
                                        onClick={() => handleToggle(selectedProperty._id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors border ${selectedProperty.isActive
                                            ? "border-red-200 text-red-600 hover:bg-red-50"
                                            : "border-green-200 text-green-600 hover:bg-green-50"
                                            }`}
                                    >
                                        {selectedProperty.isActive ? "Deactivate Property" : "Activate Property"}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(selectedProperty)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedProperty._id)}
                                        className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Viewer Modal */}
                {imageViewer && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4" onClick={() => setImageViewer(null)}>
                        <button
                            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-[70] bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
                            onClick={() => { setImageViewer(null); setCurrentImageIndex(0); }}
                        >
                            &times;
                        </button>

                        {/* Previous Button */}
                        {selectedProperty.images.length > 1 && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-[70] bg-black/50 rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/70 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex((prev) => prev === 0 ? selectedProperty.images.length - 1 : prev - 1);
                                }}
                            >
                                ‹
                            </button>
                        )}

                        {/* Image Display */}
                        <div className="relative w-full h-full flex items-center justify-center p-16" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={`http://localhost:5000/${selectedProperty.images[currentImageIndex].replace(/\\/g, '/')}`}
                                alt={`Property ${currentImageIndex + 1}`}
                                className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
                            />

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                {currentImageIndex + 1} / {selectedProperty.images.length}
                            </div>
                        </div>

                        {/* Next Button */}
                        {selectedProperty.images.length > 1 && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-[70] bg-black/50 rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/70 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex((prev) => prev === selectedProperty.images.length - 1 ? 0 : prev + 1);
                                }}
                            >
                                ›
                            </button>
                        )}

                        {/* Thumbnail Indicators */}
                        {selectedProperty.images.length > 1 && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-[70]">
                                {selectedProperty.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

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

                {/* Properties List (Card Layout) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {selectedCity ? "Filtered Properties" : "All Properties"}
                        </h2>
                        {/* You could add a refined sort or view toggle here later */}
                    </div>

                    {loading && (
                        <div className="text-center py-12 text-gray-500 animate-pulse">
                            Loading properties...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {!loading && properties.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No properties found. Add one above.</p>
                        </div>
                    )}

                    {!loading && properties.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <div
                                    key={property._id}
                                    onClick={() => setSelectedProperty(property)}
                                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                                >
                                    {/* Card Image */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {property.images && property.images.length > 0 ? (
                                            <img
                                                src={`http://localhost:5000/${property.images[0].replace(/\\/g, '/')}`}
                                                alt={property.projectName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaImage className="text-3xl opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${property.isActive ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                                                }`}>
                                                {property.isActive ? "ACTIVE" : "INACTIVE"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{property.projectName}</h3>
                                                <p className="text-sm text-gray-500">{property.builderName}</p>
                                            </div>
                                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-semibold">{property.propertyType}</span>
                                        </div>

                                        <div className="space-y-2 mt-4 mb-4 flex-1">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaMapMarkerAlt className="mr-2 text-gray-400 w-4" />
                                                <span className="truncate">{property.location}, {property.city?.name}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaRupeeSign className="mr-2 text-gray-400 w-4" />
                                                <span className="font-semibold text-gray-900">{formatPrice(property.minimumPrice)}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaUsers className="mr-2 text-gray-400 w-4" />
                                                <span>{property.currentGroup?.memberCount || 0} / {property.minimumGroupSize} Members</span>
                                            </div>
                                        </div>

                                        <button className="w-full mt-auto py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium rounded-lg transition-colors text-sm border border-gray-100 group-hover:border-blue-100">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Property Form (Moved to bottom or kept here? Kept here for Admin workflow efficiency, maybe separate component later) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => document.getElementById('addPropertyForm').classList.toggle('hidden')}>
                        <h2 className="text-xl font-semibold flex items-center text-gray-800">
                            <FaPlus className="mr-2 text-blue-500" /> Add New Property Project
                        </h2>
                        <span className="text-sm text-gray-500 hover:text-blue-500">Toggle Form</span>
                    </div>
                    <div id="addPropertyForm" className="hidden">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                                    <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Enter project name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Builder Name *</label>
                                    <input type="text" name="builderName" value={formData.builderName} onChange={handleChange} placeholder="Enter builder name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
                                    <label className="block text-sm font-medium text-gray-700">Location *</label>
                                    <div className="flex gap-2">
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location/area" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        <button
                                            type="button"
                                            onClick={handleGeocode}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                            title="Locate on Map"
                                        >
                                            <FaSearch /> <span className="hidden sm:inline">Locate</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="">Select Type</option>
                                        <option value="Flat">Flat</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Plot">Plot</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Minimum Price (₹) *</label>
                                    <input type="number" name="minimumPrice" value={formData.minimumPrice} onChange={handleChange} placeholder="Enter minimum price" min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex justify-between">
                                    <span>Map Location (Click or drag marker to adjust)</span>
                                    <span className="text-xs text-gray-500">Lat: {formData.lat || 'N/A'}, Lng: {formData.lng || 'N/A'}</span>
                                </label>
                                <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 z-0">
                                    <MapComponent
                                        center={formData.lat && formData.lng ? [parseFloat(formData.lat), parseFloat(formData.lng)] : [20.5937, 78.9629]}
                                        zoom={formData.lat ? 15 : 5}
                                        height="320px"
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
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitude" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" step="any" />
                                    <input type="number" name="lng" value={formData.lng} onChange={handleChange} placeholder="Longitude" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" step="any" />
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-2">Group Buying Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Minimum Group Size *</label>
                                    <input type="number" name="minimumGroupSize" value={formData.minimumGroupSize} onChange={handleChange} placeholder="e.g., 5" min="1" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Group Joining Deadline *</label>
                                    <input type="date" name="groupJoiningDeadline" value={formData.groupJoiningDeadline} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Token Amount (₹) *</label>
                                    <input type="number" name="tokenAmount" value={formData.tokenAmount} onChange={handleChange} placeholder="Platform service fee" min="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Group Rules (Optional)</label>
                                    <textarea name="groupRules" value={formData.groupRules} onChange={handleChange} placeholder="Enter group rules and terms..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Images (Max 5)</label>
                                    <div className="flex items-center space-x-2">
                                        <FaImage className="text-gray-400" />
                                        <input type="file" name="images" onChange={handleChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Brochure (PDF)</label>
                                    <div className="flex items-center space-x-2">
                                        <FaFilePdf className="text-gray-400" />
                                        <input type="file" name="brochure" onChange={handleChange} accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>
                                </div>
                            </div>

                            {formError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{formError}</p>}

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={formLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-50">{formLoading ? "Adding..." : "Add Property"}</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PropertyManagement;
