import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { setServers } from "node:dns/promises"
setServers(["8.8.8.8", "8.8.4.4"]);
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import cityRoutes from "./routes/cityRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import dealershipRoutes from "./routes/dealershipRoutes.js"
import propertyRoutes from "./routes/propertyRoutes.js"
import propertyGroupRoutes from "./routes/propertyGroupRoutes.js"
import groupMemberRoutes from "./routes/groupMemberRoutes.js"
import dealershipGroupRoutes from "./routes/dealershipGroupRoutes.js"
import dealershipGroupMemberRoutes from "./routes/dealershipGroupMemberRoutes.js"
import groupChatRoutes from "./routes/groupChatRoutes.js"
import dealershipGroupChatRoutes from "./routes/dealershipGroupChatRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
dotenv.config()
connectDB()

import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all frontend origins
        methods: ["GET", "POST"]
    }
});

// Make io accessible in controllers
app.set("io", io);

app.use(cors());
app.use(express.json());

// Socket.io Connection Logic
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_group", (groupId) => {
        socket.join(groupId);
        console.log(`User ${socket.id} joined group: ${groupId}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

app.use("/api/auth", authRoutes)
app.use("/api/cities", cityRoutes)
app.use("/api/user", userRoutes)
app.use("/api/dealerships", dealershipRoutes)
app.use("/api/properties", propertyRoutes)
app.use("/api/property-groups", propertyGroupRoutes)
app.use("/api/group-members", groupMemberRoutes)
app.use("/api/dealership-groups", dealershipGroupRoutes)
app.use("/api/dealership-group-members", dealershipGroupMemberRoutes)
app.use("/api/group-chat", groupChatRoutes)
app.use("/api/dealership-group-chat", dealershipGroupChatRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/payments", paymentRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("API Running")
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`))
