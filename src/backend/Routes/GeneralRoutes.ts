import express from "express";
const Router = express.Router();

import {
	getAllPendingCommittees,
	actionOnPendingCommittee,
} from "../Controllers/GeneralController";

Router.route("/getAllPendingCommittees").post(getAllPendingCommittees);

Router.route("/actionOnPendingCommittee").post(actionOnPendingCommittee);

export default Router;
