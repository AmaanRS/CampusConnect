import express from "express";
const Router = express.Router();

import {
	createAdmin,
	getAdmin,
	updateAdmin,
	deleteAdmin,
	changeUserAccountStatusByEmail,
} from "../Controllers/AdminController";
// import { authorizationMiddlewareFactory } from "../Middlewares/Authorization";
// import { AccountType, AdminPosition } from "../Types/ModelTypes";

Router.route("/createAdmin").post(createAdmin);

Router.route("/getAdmin").post(getAdmin);

Router.route("/updateAdmin").post(updateAdmin);

Router.route("/deleteAdmin").post(deleteAdmin);

Router.route("/deleteUserByEmail").post(changeUserAccountStatusByEmail);

export default Router;
