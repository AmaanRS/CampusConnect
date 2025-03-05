import express from "express";
const Router = express.Router();

import {
	getAllPendingCommittees,
	getAllDeletedCommittees,
	updateCommitteeByAdmin,
	changeStatusOfCommittee,
} from "../Controllers/GeneralController";

Router.route("/getAllPendingCommittees").post(getAllPendingCommittees);

Router.route("/getAllDeletedCommittees").post(getAllDeletedCommittees);

Router.route("/updateCommitteeByAdmin").post(updateCommitteeByAdmin);

Router.route("/changeStatusOfCommittee").post(changeStatusOfCommittee);

export default Router;
