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
		committeeDocId: {
			type: Schema.Types.ObjectId,
			ref: "committeeModel",
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
			ref: "studentModel",
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

// postSchema.pre("validate", async function (next) {
// 	try {
// 		if (this.position === undefined) {
// 			this.position = [];
// 		}

// 		if (this.position.length === 0) {
// 			throw new MongooseError("Position for admin cannot be empty");
// 		}

// 		const hashedPassword = await validateAndHash(this.password);
// 		this.password = hashedPassword;

// 		//By default
// 		this.isProfileComplete = false;

// 		this.accType = AccountType.Admin;

// 		this.position = [AdminPosition.Admin];

// 		// this.position = this.position ? [...new Set(this.position)] : undefined;
// 		// Converted set to array because i need position to be unique but mongodb supports array not set
// 		this.position = [...new Set(this.position)];

// 		next();
// 	} catch (err) {
// 		next(err as MongooseError);
// 	}
// });

// adminSchema.pre("save", async function (next) {
// 	try {
// 		// If all fields are given except the optional fields then set isProfileComplete to true
// 		if (this.email && this.password && this.accType && this.position) {
// 			this.isProfileComplete = true;
// 		}
// 		next();
// 	} catch (err) {
// 		next(err as MongooseError);
// 	}
// });

// TODO: Add isPostDeleted and mongoose middlewares to not show posts which are deleted
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
