import { Schema, Model, model, MongooseError, Types } from "mongoose";
import { IPromotionDocument, ModelTypes } from "../Types/ModelTypes";
import _ from "lodash";
import { DataResponse } from "../Types/GeneralTypes";
import { generateUniqueId } from "../Utils/uniqueId";

const promotionSchema = new Schema<IPromotionDocument>(
	{
		promoId: {
			required: true,
			type: String,
			unique: true,
		},
		promoImage: {
			type: [
				{
					imageUrl: {
						type: String,
						required: true,
					},
					imagePath: {
						type: String,
						required: true,
					},
				},
			],
			default: [],
		},
		promoLink: {
			required: true,
			type: String,
			unique: true,
		},
		promotedBy: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "committeeModel",
				},
			],
			default: [],
		},
		isPromotionDeleted: {
			default: false,
			type: Boolean,
		},
	},
	{
		timestamps: true,
	},
);

promotionSchema.pre("validate", async function (next) {
	try {
		if (!this.promoId) {
			while (true) {
				const uniqueId = await generateUniqueId(ModelTypes.PROMOTION_MODEL);
				if (uniqueId.success && "data" in uniqueId) {
					this.promoId = (uniqueId as DataResponse).data as string;
					break;
				}
			}
		}

		if (!Array.isArray(this.promoImage) || this.promoImage.length === 0) {
			throw new MongooseError("Send the image for promotion");
		}

		if (!Array.isArray(this.promotedBy) || this.promotedBy.length === 0) {
			throw new MongooseError("Send the committee who is promoting");
		}

		this.promotedBy = _.chain(this.promotedBy)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();
	} catch (err) {
		next(err as MongooseError);
	}
});

// Hooks for which deleted promotions will not be returned
const hooks = [
	"find",
	"findOne",
	"findOneAndUpdate",
	"deleteOne",
	"deleteMany",
	"updateOne",
	"updateMany",
] as const;

// Programatically adds condition to remove deleted promotions from the query result
// When deleted promotions are also needed and should not be excluded set _skipDeletedPromotionsHook
// If in some place this code gives error then set _skipDeletedPromotionsHook as true
hooks.forEach(function (hook) {
	promotionSchema.pre(hook, function (next) {
		const options = this.getOptions();
		const query = this.getQuery();

		// _skipDeletedPromotionsHook; flag when true, will allow hooks to show deleted promotions
		if (options && !options["_skipDeletedPromotionsHook"]) {
			// If "isPromotionDeleted" already exists as an object
			if (
				query["isPromotionDeleted"] &&
				typeof query["isPromotionDeleted"] === "object"
			) {
				if (query["isPromotionDeleted"]["$nin"]) {
					// Add true to $nin if it doesn't already exist
					if (!query["status"]["$nin"].includes(true)) {
						query["status"]["$nin"].push(true);
					}
				} else {
					query["isPromotionDeleted"]["$nin"] = [true];
				}
			} else {
				// If "status" doesn't exist, create $nin with true
				query["isPromotionDeleted"] = { $ne: true };
			}
		}
		next();
	});
});

export const promotionModel: Model<IPromotionDocument> = model<IPromotionDocument>(
	"promotionModel",
	promotionSchema,
);
