import express from "express";
const Router = express.Router();

import {
	createEvent,
	getEvent,
	updateEvent,
	deleteEvent,
	getAllEvents,
} from "../Controllers/EventController";

Router.route("/createEvent").post(createEvent);

Router.route("/getEvent").post(getEvent);

Router.route("/updateEvent").post(updateEvent);

Router.route("/deleteEvent").post(deleteEvent);

Router.route("/getAllEvents").post(getAllEvents);

export default Router;
