import express from "express";
const Router = express.Router();

import { login, signup, profileStatus } from "../Controllers/UserController";
// import { getAllEvents, createEvent } from "../Controllers/CommitteeController";

//UserController Routes
Router.route("/login").post(login);
Router.route("/signup").post(signup);
Router.route("/getUserProfileStatus").post(profileStatus);
// Router.route("/updateUserProfile").post( updateUserProfile);
// Router.route("/validateUser").post(cookieCheckerFunction);

export default Router;
