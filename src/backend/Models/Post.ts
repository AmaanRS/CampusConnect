import { Model, MongooseError, Schema, model } from "mongoose";
import { IPostDocument, ModelTypes } from "../Types/ModelTypes";
import { generateUniqueId } from "../Utils/uniqueId";
import { DataResponse } from "../Types/GeneralTypes";

const postSchema = new Schema<IPostDocument>(
	{
		postId: {
			required: true,
			type: String,
		},
		committeeObjId: {
			type: Schema.Types.ObjectId,
			ref: "committeeModel",
			required: true,
		},
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: "userModel",
			required: true,
		},
		title: {
			required: true,
			type: String,
		},
		content: {
			type: String,
			required: true,
		},
		relevantLinks: {
			type: [String],
			default: [],
		},
		image: {
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
		likes: {
			type: [Schema.Types.ObjectId],
			ref: "userModel",
			default: [],
		},
		commentObjId: {
			type: Schema.Types.ObjectId,
			ref: "commentModel",
			required: true,
		},
		isPostDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Hooks for which inactive teacher will not be returned
const hooks = [
	"find",
	"findOne",
	"findOneAndUpdate",
	"deleteOne",
	"deleteMany",
	"updateOne",
	"updateMany",
] as const;

// Programatically adds condition to remove inactive teachers from the query result
// When inactive teachers are also needed and should not be excluded set _skipDeletedPostsHook
// If in some place this code gives error then set _skipDeletedPostsHook as true
hooks.forEach(function (hook) {
	postSchema.pre(hook, function (next) {
		const options = this.getOptions();
		const query = this.getQuery();

		// _skipDeletedPostsHook; flag when true, will allow hooks to show inactive teachers
		if (options && !options["_skipDeletedPostsHook"]) {
			// If "isPostDeleted" already exists as an object
			if (
				query["isPostDeleted"] &&
				typeof query["isPostDeleted"] === "object"
			) {
				if (query["isPostDeleted"]["$nin"]) {
					// Add true to $nin if it doesn't already exist
					if (!query["status"]["$nin"].includes(true)) {
						query["status"]["$nin"].push(true);
					}
				} else {
					query["isPostDeleted"]["$nin"] = [true];
				}
			} else {
				// If "status" doesn't exist, create $nin with true
				query["isPostDeleted"] = { $ne: true };
			}
		}
		next();
	});
});

postSchema.pre("validate", async function (next) {
	try {
		if (!this.postId) {
			while (true) {
				const uniqueId = await generateUniqueId(ModelTypes.POST_MODEL);
				if (uniqueId.success && "data" in uniqueId) {
					this.postId = (uniqueId as DataResponse).data as string;
					break;
				}
			}
		}

		if (
			this.image &&
			(!Array.isArray(this.image) ||
				this.image.some((img) => !img.imageUrl || !img.imagePath))
		) {
			throw new MongooseError("Give image in proper structure");
		}

		if (this.image === undefined) this.image = [];
		if (this.likes === undefined) this.likes = [];

		next();
	} catch (error) {
		next(error as MongooseError);
	}
});

export const postModel: Model<IPostDocument> = model<IPostDocument>(
	"postModel",
	postSchema,
);
