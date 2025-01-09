import express from "express";
const Router = express.Router();

import {
	getAllPendingCommittees,
	getAllDeletedCommittees,
} from "../Controllers/GeneralController";

Router.route("/getAllPendingCommittees").post(getAllPendingCommittees);

Router.route("/actionOnPendingCommittee").post(getAllDeletedCommittees);

export default Router;
