import express from "express";
const Router = express.Router();

import {
	createCommittee,
	getCommitteeById,
	updateCommittee,
	addMembersInCommittee,
	removeMembersFromCommittee,
	getAllCommittees,
	toggleFollower,
} from "../Controllers/CommitteeController";

Router.route("/createCommittee").post(createCommittee);

Router.route("/getCommitteeById").post(getCommitteeById);

Router.route("/updateCommittee").post(updateCommittee);

Router.route("/addMembersInCommittee").post(addMembersInCommittee);

Router.route("/removeMembersFromCommittee").post(removeMembersFromCommittee);

Router.route("/getAllCommittees").post(getAllCommittees);

Router.route("/toggleFollower").post(toggleFollower);

export default Router;
