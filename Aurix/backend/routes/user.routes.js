import express from "express";
import {
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

import upload from "../middlewares/multer.js";

//this takes only Router from express not everthing
//this makes sure the file is not bulky
const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

//here in place of update we can write anything we like..Since we are updating update is written here.

//changed little code here
userRouter.post(
  "/update",
  isAuth,
  upload.single("assistantImage"),
  updateAssistant
);

export default userRouter;
