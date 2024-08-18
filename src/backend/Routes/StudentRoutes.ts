import express from "express";
export const Router = express.Router();
import {
	cookieCheckerMiddleware,
} from "../Middlewares/CookieChecker";
// Router.route("/signup").post(signup);
