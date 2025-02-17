import { Model, MongooseError, Schema, Types, model } from "mongoose";
import { IEventDocument, ModelTypes } from "../Types/ModelTypes";
import { generateUniqueId } from "../Utils/uniqueId";
import { DataResponse } from "../Types/GeneralTypes";
import { isValidDateTimeRange } from "../Utils/dateTime";
import _ from "lodash";

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
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			required: true,
		},
		startTime: {
			type: String,
			required: true,
		},
		endTime: {
			type: String,
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

eventSchema.pre("validate", async function (next) {
	try {
		// If eventId is given use it (this is for updating an event)
		if (!this.eventId) {
			let count = 0;
			while (true) {
				const uniqueId = await generateUniqueId(ModelTypes.EVENT_MODEL);
				if (uniqueId.success && "data" in uniqueId) {
					this.eventId = (uniqueId as DataResponse).data as string;
					break;
				}
				count++;
				if (count > 3) {
					throw new MongooseError(
						"Could not create unique id and could not create event",
					);
				}
			}
		}

		// Validate date and time
		const isValidRange = isValidDateTimeRange({
			startDate: this.startDate.toString(),
			startTime: this.startTime.toString(),
			endDate: this.endDate.toString(),
			endTime: this.endTime.toString(),
		});

		if (!isValidRange.success) {
			throw new MongooseError(isValidRange.message);
		}

		// Validation check for empty arrays in the schema since mongoose allows empty array even though required true is written

		if (!Array.isArray(this.hostingCommittees)) {
			throw new MongooseError("Hosting committee should be an array");
		}

		if (this.hostingCommittees.length < 1) {
			throw new MongooseError("There should be some hosting committee");
		}

		this.hostingCommittees = _.chain(this.hostingCommittees)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const eventModel: Model<IEventDocument> = model<IEventDocument>(
	"eventModel",
	eventSchema,
);
