import express from "express";
export const Router = express.Router();
import { cookieCheckerFunction } from "../Middlewares/CookieChecker";
import { login, signup } from "../Controllers/UserController";

Router.route("/validateUser").post(cookieCheckerFunction);
Router.route("/login").post(login);
Router.route("/signup").post(signup);

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
