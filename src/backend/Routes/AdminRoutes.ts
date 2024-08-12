import express from 'express';
const Router = express.Router()
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createAdmin,
	getAdmin,
	updateAdmin,
	deleteAdmin,
} from "../Controllers/AdminController";

Router.route("/createAdmin").post(cookieCheckerMiddleware,createAdmin)
Router.route("/getAdmin").get(cookieCheckerMiddleware, getAdmin);
Router.route("/updateAdmin").post(cookieCheckerMiddleware, updateAdmin);
Router.route("/deleteAdmin").post(cookieCheckerMiddleware, deleteAdmin);

export default Router;