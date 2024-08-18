import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createTeacher,
	getTeacher,
	updateTeacher,
	deleteTeacher,
} from "../Controllers/TeacherController";

Router.route("/createTeacher").post(cookieCheckerMiddleware, createTeacher);
Router.route("/getTeacher").post(cookieCheckerMiddleware, getTeacher);
Router.route("/updateTeacher").post(cookieCheckerMiddleware, updateTeacher);
Router.route("/deleteTeacher").post(cookieCheckerMiddleware, deleteTeacher);

export default Router;
