import express from "express";
const Router = express.Router();
import {
	cookieCheckerMiddleware,
	// cookieCheckerFunction,
} from "../Middlewares/CookieChecker";

import {
	login,
	signup,
	profileStatus,
	// updateUserProfile,
} from "../Controllers/UserController";
// import { getAllEvents, createEvent } from "../Controllers/CommitteeController";

//UserController Routes
Router.route("/login").post(login);
Router.route("/signup").post(signup);
Router.route("/getUserProfileStatus").post(cookieCheckerMiddleware, profileStatus);
// Router.route("/updateUserProfile").post(cookieCheckerMiddleware, updateUserProfile);
// Router.route("/validateUser").post(cookieCheckerFunction);

//CommitteeController Routes
// Router.route("/getAllEvents").get(getAllEvents);
// Router.route("/createEvent").post(cookieCheckerMiddleware, createEvent);

// const {
// 	login,
// 	signup,
// 	mainPage,
// 	getUserData,
// 	getAllUsersEmail,
// 	addFriendBothWays,
// 	getUserConversation,
// } = require("../Controllers/UserController");

// Router.route("/login").post(login);
// Router.route("/signup").post(signup);
// Router.route("/main").post(cookieChecker, mainPage);
// Router.route("/getUserData").post(cookieChecker, getUserData);
// Router.route("/getAllUsersEmail").post(cookieChecker, getAllUsersEmail);
// Router.route("/addFriendBothWays").post(cookieChecker, addFriendBothWays);
// Router.route("/getUserConversation").post(cookieChecker, getUserConversation);

export default Router;
