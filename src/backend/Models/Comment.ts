import { Model, model, Schema } from "mongoose";
import { ICommentDocument } from "../Types/ModelTypes";

const commentSchema = new Schema<ICommentDocument>(
	{
		postObjId: {
			type: Schema.Types.ObjectId,
			ref: "postModel",
		},
		comments: {
			type: [
				{
					userId: {
						type: Schema.Types.ObjectId,
						ref: "userModel",
						required: true,
					},
					comment: {
						type: String,
						required: true,
					},
				},
			],
			default: [],
		},
		isCommentSectionDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Hooks for which deleted comment section will not be returned
const hooks = [
	"find",
	"findOne",
	"findOneAndUpdate",
	"deleteOne",
	"deleteMany",
	"updateOne",
	"updateMany",
] as const;

// Programatically adds condition to not return deleted comment section from the query result
// When deleted comment section is also needed and should not be excluded set _skipDeletedCommentSectionInHook
// If in some place this code gives error then set _skipDeletedCommentSectionInHook as true
hooks.forEach(function (hook) {
	commentSchema.pre(hook, function (next) {
		const options = this.getOptions();
		const query = this.getQuery();

		// _skipDeletedCommentSectionInHook; flag when true, will allow hooks to show deleted comment section
		if (options && !options["_skipDeletedCommentSectionInHook"]) {
			// If "isCommentSectionDeleted" already exists as an object
			if (
				query["isCommentSectionDeleted"] &&
				typeof query["isCommentSectionDeleted"] === "object"
			) {
				if (query["isCommentSectionDeleted"]["$nin"]) {
					// Add false to $nin if it doesn't already exist
					if (!query["status"]["$nin"].includes(true)) {
						query["status"]["$nin"].push(true);
					}
				} else {
					query["isCommentSectionDeleted"]["$nin"] = [true];
				}
			} else {
				// If "status" doesn't exist, create $nin with false
				query["isCommentSectionDeleted"] = { $ne: true };
			}
		}
		next();
	});
});

//TODO: Add feature to delete single comment from comments array

export const commentModel: Model<ICommentDocument> = model(
	"commentModel",
	commentSchema,
);
