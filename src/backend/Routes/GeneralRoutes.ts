import express from "express";
const Router = express.Router();

import {
	getAllPendingCommittees,
	getAllDeletedCommittees,
	updateCommitteeByAdmin,
} from "../Controllers/GeneralController";

Router.route("/getAllPendingCommittees").post(getAllPendingCommittees);

Router.route("/getAllDeletedCommittees").post(getAllDeletedCommittees);

Router.route("/updateCommitteeByAdmin").post(updateCommitteeByAdmin);

export default Router;
