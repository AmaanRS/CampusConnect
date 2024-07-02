import { Model, Schema, model } from "mongoose";
import { ICommittee } from "../BackendTypes";
// import { eventModel } from './Event';
// import { userModel } from "./User";

const committeeSchema = new Schema<ICommittee>(
	{
		name: {
			required: true,
			type: String,
			trim: true,
		},
		head: {
			type: Schema.Types.ObjectId,
			ref: "userModel",
            required: true,
		},
		viceHead: {
			type: Schema.Types.ObjectId,
			ref: "userModel",
            required: true,
		},
		teacherIncharge: {
			type: Schema.Types.ObjectId,
			ref: "userModel",
            required: true,
		},
		description: {
			type: String,
            required: true,
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "userModel",
                required: true,
			},
		],
		events: [
			{
				type: Schema.Types.ObjectId,
				ref: "eventModel",
			},
		],
	},
	{
		timestamps: true,
	},
);

export const committeeModel: Model<ICommittee> = model<ICommittee>(
	"committeeModel",
	committeeSchema,
);
