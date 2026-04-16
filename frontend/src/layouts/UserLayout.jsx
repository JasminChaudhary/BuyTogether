import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../components/layout/footer";

const UserLayout = () => {
    const userLinks = [
        { label: "How It Works", path: "/user/how-it-works" },
        { label: "Buying Groups", path: "/user/my-groups" },
        { label: "About", path: "/user/about" },
    ];

    return (
        <div style={styles.layout}>
            <Navbar role="BUYER" links={userLinks} />
            <main style={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

const styles = {
    layout: {
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
    },
    main: {
        flex: 1,
    },
};

export default UserLayout;
