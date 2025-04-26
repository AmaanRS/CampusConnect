import express from "express";
const Router = express.Router();

import {
	createTeacher,
	getTeacher,
	updateTeacher,
	deleteTeacher,
	getAllTeachers,
	getAllFacultysEmail,
	getAllTeacherData,
} from "../Controllers/TeacherController";

Router.route("/createTeacher").post(createTeacher);
Router.route("/getTeacher").post(getTeacher);
Router.route("/updateTeacher").post(updateTeacher);
Router.route("/deleteTeacher").post(deleteTeacher);
Router.route("/getAllTeachers").post(getAllTeachers);
Router.route("/getAllFacultysEmail").post(getAllFacultysEmail);
Router.route("/getAllTeacherData").post(getAllTeacherData);

export default Router;
