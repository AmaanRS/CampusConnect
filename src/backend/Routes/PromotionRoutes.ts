import express from "express";
import {
	createPromotion,
	deletePromotion,
	getAllPromotions,
} from "../Controllers/PromotionController";
const Router = express.Router();

Router.route("/createPromotion").post(createPromotion);
Router.route("/deletePromotion").post(deletePromotion);
Router.route("/getAllPromotions").post(getAllPromotions);

export default Router;
