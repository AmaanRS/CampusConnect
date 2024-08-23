import { Model, model, Schema } from "mongoose";
import { IUniqueIdDocument } from "../Types/ModelTypes";

const documentSchema = new Schema<IUniqueIdDocument>({
	uniqueIds: {
		type: [String],
		required: true,
		unique: true,
	},
});

export const uniqueIdModel: Model<IUniqueIdDocument> = model<IUniqueIdDocument>(
	"uniqueIdModel",
	documentSchema,
);
