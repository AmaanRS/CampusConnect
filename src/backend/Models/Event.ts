import { Model, Schema, model } from "mongoose";
import { IEvent } from "../BackendTypes";
import { committeeModel } from "./Committee";

const eventSchema = new Schema<IEvent>(
	{
		name: {
			required: true,
			type: String,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		hostingCommittees: [
			{
				type: Schema.Types.ObjectId,
				ref: committeeModel,
				required: true,
			},
		],
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export const eventModel: Model<IEvent> = model<IEvent>(
	"eventModel",
	eventSchema,
);
