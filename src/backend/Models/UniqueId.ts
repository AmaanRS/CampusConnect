import { Model, model, Schema } from "mongoose";
import { IUniqueIdDocument } from "../Types/ModelTypes";

const uniqueSchema = new Schema<IUniqueIdDocument>({
	uniqueId: {
		type: String,
		required: true,
		unique: true,
	},
});

uniqueSchema.index({ uniqueId: 1 }, { unique: true });

export const uniqueIdModel: Model<IUniqueIdDocument> = model<IUniqueIdDocument>(
	"uniqueIdModel",
	uniqueSchema,
);
