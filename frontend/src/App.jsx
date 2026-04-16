import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminDashboard from "./admin/pages/AdminDashboard";
import CityManagement from "./admin/pages/CityManagement";
import DealershipManagement from "./admin/pages/DealershipManagement";
import PropertyManagement from "./admin/pages/PropertyManagement";
import GroupManagement from "./admin/pages/GroupManagement";
import AdminProfile from "./admin/pages/AdminProfile";
import AdminSettings from "./admin/pages/AdminSettings";
import UserLanding from "./user/pages/UserLanding";
import PropertyListing from "./user/pages/PropertyListing";
import DealershipListing from "./user/pages/DealershipListing";
import DealershipDetail from "./user/pages/DealershipDetail";
import PropertyDetail from "./user/pages/PropertyDetail";
import MyGroups from "./user/pages/MyGroups";
import GroupChat from "./user/components/GroupChat";
import UserProfile from "./user/pages/UserProfile";
import UserDashboard from "./user/pages/UserDashboard";
import HowItWorks from "./user/pages/HowItWorks";
import About from "./user/pages/About";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./common/ProtectedRoute";

const App = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cities" element={<CityManagement />} />
          <Route path="dealerships" element={<DealershipManagement />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="groups/:groupId/chat" element={<GroupChat />} />
          <Route path="dealership-groups/:groupId/chat" element={<GroupChat />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserLanding />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="properties" element={<PropertyListing />} />
          <Route path="dealerships" element={<DealershipListing />} />
          <Route path="dealerships/:id" element={<DealershipDetail />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="my-groups" element={<MyGroups />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="groups/:groupId/chat" element={<GroupChat />} />
          <Route path="dealership-groups/:groupId/chat" element={<GroupChat />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
