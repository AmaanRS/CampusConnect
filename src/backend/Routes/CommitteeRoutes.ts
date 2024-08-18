import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createCommittee,
	getCommittee,
	updateCommittee,
	deleteCommittee,
} from "../Controllers/CommitteeController";
import { authorizationMiddlewareFactory } from "../Middlewares/Authorization";
import { AccountType, TeacherPosition } from "../Types/ModelTypes";

Router.route("/createCommittee").post(
	cookieCheckerMiddleware,
	authorizationMiddlewareFactory(
		[TeacherPosition.HOD, TeacherPosition.HOD],
		AccountType.Teacher,
	),
	createCommittee,
);

Router.route("/getCommittee").post(cookieCheckerMiddleware, getCommittee);

Router.route("/updateCommittee").post(
	cookieCheckerMiddleware,
	authorizationMiddlewareFactory(
		[TeacherPosition.HOD, TeacherPosition.HOD],
		AccountType.Teacher,
	),
	updateCommittee,
);

Router.route("/deleteCommittee").post(
	cookieCheckerMiddleware,
	authorizationMiddlewareFactory(
		[TeacherPosition.HOD, TeacherPosition.HOD],
		AccountType.Teacher,
	),
	deleteCommittee,
);

export default Router;
