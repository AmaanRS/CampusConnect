import express from "express";
const Router = express.Router();

import {
	createStudent,
	getStudent,
	updateStudent,
	deleteStudent,
} from "../Controllers/StudentController";

Router.route("/createStudent").post(createStudent);
Router.route("/getStudent").post(getStudent);
Router.route("/updateStudent").post(updateStudent);
Router.route("/deleteStudent").post(deleteStudent);

export default Router;
