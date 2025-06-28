import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const port = process.env.PORT || 5000;
//middleware to read body
app.use(express.json());
//middleware for cookie-parser
app.use(cookieParser());

//middleware
app.use("/api/auth", authRouter);
app.listen(port, () => {
  connectDb();
  console.log("App is running");
});
