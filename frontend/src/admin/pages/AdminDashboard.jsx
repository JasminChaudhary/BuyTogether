import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../common/api";
import { FaCity, FaBuilding, FaHome, FaUsers, FaChartLine, FaCar } from "react-icons/fa";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCities: 0,
        totalProperties: 0,
        totalDealerships: 0,
        totalGroups: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [citiesRes, propertiesRes, dealershipsRes, propGroupsRes, dealGroupsRes] = await Promise.all([
                    api.get("/cities"),
                    api.get("/properties"),
                    api.get("/dealerships"),
                    api.get("/property-groups"),
                    api.get("/dealership-groups"),
                ]);

                setStats({
                    totalCities: citiesRes.data?.filter(c => c.isActive)?.length || 0,
                    totalProperties: propertiesRes.data?.length || 0,
                    totalDealerships: dealershipsRes.data?.length || 0,
                    totalGroups: 
                        (propGroupsRes.data?.filter(g => g.property != null)?.length || 0) + 
                        (dealGroupsRes.data?.filter(g => g.dealership != null)?.length || 0),
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, <span className="text-blue-600">{user.name || "Admin"}</span>
                    </h1>
                    <p className="text-gray-600">
                        Manage your BuyTogether platform efficiently from your centralized dashboard.
                    </p>
                </div>

                {/* Stats Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Active Cities */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaCity className="text-blue-600 text-xl" />
                                </div>
                                <FaChartLine className="text-gray-300" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCities}</div>
                            <div className="text-sm text-gray-600 font-medium">Active Cities</div>
                        </div>

                        {/* Properties */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FaHome className="text-green-600 text-xl" />
                                </div>
                                <FaChartLine className="text-gray-300" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProperties}</div>
                            <div className="text-sm text-gray-600 font-medium">Properties</div>
                        </div>

                        {/* Dealerships */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FaCar className="text-purple-600 text-xl" />
                                </div>
                                <FaChartLine className="text-gray-300" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalDealerships}</div>
                            <div className="text-sm text-gray-600 font-medium">Dealerships</div>
                        </div>

                        {/* Groups */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <FaUsers className="text-orange-600 text-xl" />
                                </div>
                                <FaChartLine className="text-gray-300" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalGroups}</div>
                            <div className="text-sm text-gray-600 font-medium">Groups</div>
                        </div>
                    </div>
                )}

                {/* Management Cards */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Platform Management</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Cities */}
                        <Link to="/admin/cities" className="group">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FaCity className="text-blue-600 text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Cities</h3>
                                <p className="text-sm text-gray-600">
                                    Add, edit, and manage cities available on the platform
                                </p>
                            </div>
                        </Link>

                        {/* Dealerships */}
                        <Link to="/admin/dealerships" className="group">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FaCar className="text-purple-600 text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Dealerships</h3>
                                <p className="text-sm text-gray-600">
                                    Oversee car dealerships and their inventory
                                </p>
                            </div>
                        </Link>

                        {/* Properties */}
                        <Link to="/admin/properties" className="group">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FaHome className="text-green-600 text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Properties</h3>
                                <p className="text-sm text-gray-600">
                                    Add and manage property projects across cities
                                </p>
                            </div>
                        </Link>

                        {/* Groups */}
                        <Link to="/admin/groups" className="group">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 h-full">
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FaUsers className="text-orange-600 text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Groups</h3>
                                <p className="text-sm text-gray-600">
                                    Monitor and manage buyer groups and their status
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
