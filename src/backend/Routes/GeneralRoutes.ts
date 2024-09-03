import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";
import { getAllPendingCommittees } from "../Controllers/GeneralController";

Router.route("/getAllPendingCommittees").post(
	cookieCheckerMiddleware,
	getAllPendingCommittees,
);

export default Router;
