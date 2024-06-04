import { Model, Schema, model } from "mongoose";
import {
	IUser,
	Year,
	Department,
	AccountType,
	Position,
} from "../BackendTypes";

const userSchema = new Schema<IUser>(
	{
		username: {
			required: true,
			type: String,
			trim: true,
		},
		email: {
			required: true,
			type: String,
			unique: true,
		},
		password: {
			required: true,
			type: String,
		},
		year: {
			type: Number,
			enum: Object.values(Year),
		},
		division: {
			type: String,
		},
		department: {
			type: String,
			enum: Object.values(Department),
		},
		id: {
			type: Number,
		},
		accType: {
			type: String,
			enum: Object.values(AccountType),
		},
		position: {
			type: String,
			enum: Object.values(Position),
		},
		isProfileComplete: {
			default:false,
			type: Boolean,
		},
	},
	{
		timestamps: true,
	},
);

export const userModel: Model<IUser> = model<IUser>("userModel", userSchema);
