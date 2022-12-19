import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import chartRoutes from "./routes/chart.js";
import userRoutes from "./routes/user.js";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";

import { config } from "dotenv";

config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const TOKEN_KEY = process.env.TOKEN_KEY;
const app = express();
const corsOpts = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};

app.use(cookieParser())

const verifyToken = (req, res, next) => {
  const token = req.cookies["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ auth: false, message:"Invalid Token"});
  }
  return next();
};

app.use(cors(corsOpts));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", authRoutes);
app.use("/chart", chartRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Landing page",
  });
});

app.post("/welcome", verifyToken, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));