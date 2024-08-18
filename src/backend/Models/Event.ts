import { Model, MongooseError, Schema, model } from "mongoose";
import { IEventDocument } from "../Types/ModelTypes";
import { generateUniqueId } from "../Utils/uniqueId";
import { DataResponse } from "../Types/GeneralTypes";

const eventSchema = new Schema<IEventDocument>(
	{
		eventId: {
			type: String,
			required: true,
		},
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
				ref: "committeeModel",
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
		venue: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

//
// Start date/time cannot be more than end date/time
//
eventSchema.pre("validate", async function (next) {
	try {
		if (!this.eventId) {
			while (true) {
				const uniqueId = await generateUniqueId();
				if (uniqueId.success && "data" in uniqueId) {
					this.eventId = (uniqueId as DataResponse).data as string;
					break;
				}
			}
		}

		this.hostingCommittees = this.hostingCommittees
			? [...new Set(this.hostingCommittees)]
			: undefined;
	} catch (err) {
		next(err as MongooseError);
	}
});

export const eventModel: Model<IEventDocument> = model<IEventDocument>(
	"eventModel",
	eventSchema,
);
