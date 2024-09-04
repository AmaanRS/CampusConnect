import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createCommittee,
	getCommittee,
	updateCommittee,
	deleteCommittee,
} from "../Controllers/CommitteeController";

Router.route("/createCommittee").post(cookieCheckerMiddleware, createCommittee);

Router.route("/getCommittee").post(cookieCheckerMiddleware, getCommittee);

Router.route("/updateCommittee").post(cookieCheckerMiddleware, updateCommittee);

Router.route("/deleteCommittee").post(cookieCheckerMiddleware, deleteCommittee);

export default Router;
