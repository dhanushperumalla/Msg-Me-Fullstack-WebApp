import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/message.routes.js";
import userRoutes from "./Routes/user.routes.js";

import connectToMongoDB from "./db/connetToMongo.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/Front-End/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Front-End", "dist", "index.html"));
});

// app.get("/", (req, res) => {
//     res.send("Hello World!!")
// })

server.listen(5000, () => {
  connectToMongoDB();
  console.log("Server running on port 5000");
});
