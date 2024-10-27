import { Model, MongooseError, Schema, model } from "mongoose";
import { IPostDocument } from "../Types/ModelTypes";
import { generateUniqueId } from "../Utils/uniqueId";
import { DataResponse } from "../Types/GeneralTypes";

const postSchema = new Schema<IPostDocument>(
	{
		postId: {
			required: true,
			type: String,
		},
		title: {
			required: true,
			type: String,
		},
		content: {
			type: String,
			required: true,
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

postSchema.pre("validate", async function (next) {
	try {
		if (!this.postId) {
			while (true) {
				const uniqueId = await generateUniqueId();
				if (uniqueId.success && "data" in uniqueId) {
					this.postId = (uniqueId as DataResponse).data as string;
					break;
				}
			}
		}
	} catch (error) {
		next(error as MongooseError);
	}
});

export const postModel: Model<IPostDocument> = model<IPostDocument>(
	"postModel",
	postSchema,
);
