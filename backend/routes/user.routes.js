import express from "express";
import { Login, logOut, signUp } from "../controllers/auth.controller";
//this takes only Router from express not everthing
//this makes sure the file is not bulky
const userRouter = express.Router();
userRouter.post("/signup", signUp);
userRouter.post("/signin", Login);
userRouter.get("/logout", logOut);
export default userRouter;
