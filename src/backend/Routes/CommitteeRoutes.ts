import express from "express";
const Router = express.Router();

import {
	createCommittee,
	getCommittee,
	updateCommittee,
	addMembersInCommittee,
	removeMembersFromCommittee,
	getAllCommittees,
} from "../Controllers/CommitteeController";

Router.route("/createCommittee").post(createCommittee);

Router.route("/getCommittee").post(getCommittee);

Router.route("/updateCommittee").post(updateCommittee);

Router.route("/addMembersInCommittee").post(addMembersInCommittee);

Router.route("/removeMembersFromCommittee").post(removeMembersFromCommittee);

Router.route("/getAllCommittees").post(getAllCommittees);

export default Router;
