import { Model, Schema, model } from "mongoose";
import { IUser } from "../BackendTypes";

const userSchema = new Schema<IUser>(
	{
		username: {
			required: true,
			type: String,
			trim: true,
		},
		password: {
			required: true,
			type: String,
		},
		email: {
			required: true,
			type: String,
			unique: true,
		},
		//Newly added testing this field is remaining
		// friends: [
		// 	{
		// 		type: Schema.Types.ObjectId,
		// 		ref: "userModel",
		// 	},
		// ],
	},
	{
		timestamps: true,
	},
);

export const userModel: Model<IUser> = model<IUser>("userModel", userSchema);
