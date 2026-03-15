const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Required for Socket.io
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const availabilityRoutes = require("./routes/avalibilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoute");
const ChatMessage = require("./models/ChatMessage");
const productRoute = require("./routes/productRoutes");
const orderRoute = require("./routes/orderRoutes");
const cartRoute = require("./routes/cartRoutes");
const imgRoute = require("./routes/doctorImageUploadRoute");
const vendorRoute = require('./routes/vendorRoute');
const adminRoute = require('./routes/adminRoutes');
const chatbotRoute = require('./routes/chatbotRoute');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_chat", (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User with ID: ${socket.id} joined room: ${appointmentId}`);
  });

  socket.on("send_message", async (data) => {
    try {
        // VALIDATION: Check if senderId is a valid 24-character hex string
        if (!data.senderId || data.senderId.length !== 24) {
            console.error("Invalid senderId received:", data.senderId);
            return; // Stop execution to prevent Mongoose crash
        }

        const newMessage = new ChatMessage({
            appointment: data.room,
            sender: data.senderId,
            message: data.message
        });
        
        await newMessage.save();

        io.to(data.room).emit("receive_message", {
            message: data.message,
            senderId: data.senderId
        });
    } catch (e) {
        console.error("Socket Persistence Error:", e.message);
    }
});

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


  app.get("/", (req, res) => {
    res.send("BMD Backend is running successfully!");
  });

app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/cart", cartRoute);
app.use("/api/img", imgRoute);
app.use("/api/admin", adminRoute);
app.use("/api/chatbot", chatbotRoute);

const PORT = process.env.PORT || 5000;

// 4. IMPORTANT: Change app.listen to server.listen
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
    console.log(`Socket.io is initialized and ready`);
});