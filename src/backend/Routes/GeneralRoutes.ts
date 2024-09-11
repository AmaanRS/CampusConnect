import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";
import {
	getAllPendingCommittees,
	actionOnPendingCommittee,
} from "../Controllers/GeneralController";

Router.route("/getAllPendingCommittees").post(
	cookieCheckerMiddleware,
	getAllPendingCommittees,
);

Router.route("/actionOnPendingCommittee").post(
	cookieCheckerMiddleware,
	actionOnPendingCommittee,
);

export default Router;
