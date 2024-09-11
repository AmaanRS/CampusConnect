import express from "express";
const Router = express.Router();

import {
	createCommittee,
	getCommittee,
	updateCommittee,
	deleteCommittee,
} from "../Controllers/CommitteeController";

Router.route("/createCommittee").post(createCommittee);

Router.route("/getCommittee").post(getCommittee);

Router.route("/updateCommittee").post(updateCommittee);

Router.route("/deleteCommittee").post(deleteCommittee);

export default Router;
