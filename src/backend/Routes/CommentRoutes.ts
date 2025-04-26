import express from "express";
const Router = express.Router();

import { createComment } from "../Controllers/CommentController";

Router.route("/createComment").post(createComment);

export default Router;
