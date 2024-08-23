import express from "express";
const Router = express.Router();
import { cookieCheckerMiddleware } from "../Middlewares/CookieChecker";

import {
	createEvent,
	getEvent,
	updateEvent,
	deleteEvent,
} from "../Controllers/EventController";

Router.route("/createEvent").post(cookieCheckerMiddleware, createEvent);

Router.route("/getEvent").post(cookieCheckerMiddleware, getEvent);

Router.route("/updateEvent").post(cookieCheckerMiddleware, updateEvent);

Router.route("/deleteEvent").post(cookieCheckerMiddleware, deleteEvent);

export default Router;
