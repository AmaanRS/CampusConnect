import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createAdmin,
	getAdmin,
	updateAdmin,
	deleteAdmin,
	changeUserAccountStatusByEmail,
} from "../Controllers/AdminController";
import { authorizationMiddlewareFactory } from "../Middlewares/Authorization";
import { AccountType, AdminPosition } from "../Types/ModelTypes";

Router.route("/createAdmin").post(cookieCheckerMiddleware, createAdmin);

Router.route("/getAdmin").post(cookieCheckerMiddleware, getAdmin);

Router.route("/updateAdmin").post(cookieCheckerMiddleware, updateAdmin);

Router.route("/deleteAdmin").post(cookieCheckerMiddleware, deleteAdmin);

Router.route("/deleteUserByEmail").post(
	cookieCheckerMiddleware,
	authorizationMiddlewareFactory([AdminPosition.Admin], AccountType.Admin),
	changeUserAccountStatusByEmail,
);

export default Router;
