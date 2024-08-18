import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createStudent,
	getStudent,
	updateStudent,
	deleteStudent,
} from "../Controllers/StudentController";

Router.route("/createStudent").post(cookieCheckerMiddleware, createStudent);
Router.route("/getStudent").post(cookieCheckerMiddleware, getStudent);
Router.route("/updateStudent").post(cookieCheckerMiddleware, updateStudent);
Router.route("/deleteStudent").post(cookieCheckerMiddleware, deleteStudent);

export default Router;
