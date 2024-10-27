import express from "express";
import {
	createPost,
	deletePost,
	getAllPosts,
	getPost,
	updatePost,
} from "../Controllers/PostController";
const Router = express.Router();

Router.route("/createPost").post(createPost);

Router.route("/getPost").post(getPost);

Router.route("/updatePost").post(updatePost);

Router.route("/deletePost").post(deletePost);

Router.route("/getAllPosts").post(getAllPosts);

export default Router;
