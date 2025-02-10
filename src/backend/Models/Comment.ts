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
	},
	{
		timestamps: true,
	},
);

export const commentModel: Model<ICommentDocument> = model(
	"commentModel",
	commentSchema,
);
