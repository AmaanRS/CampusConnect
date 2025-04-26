import express from "express";
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	updatePost,
	togglePostLike,
} from "../Controllers/PostController";
const Router = express.Router();

Router.route("/createPost").post(createPost);

Router.route("/getPostById").post(getPostById);

Router.route("/updatePost").post(updatePost);

Router.route("/deletePost").post(deletePost);

Router.route("/getAllPosts").post(getAllPosts);

Router.route("/togglePostLike").post(togglePostLike);

export default Router;
