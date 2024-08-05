import { Model, MongooseError, Schema, model } from "mongoose";
import {
	AccountType,
	INonTeachingStaffDocument,
	Department,
	NonTeachingStaffPosition,
} from "../Types/ModelTypes";
import { emailRegex, validateAndHash } from "../Utils/util";

const nonTeachingStaffSchema = new Schema<INonTeachingStaffDocument>(
	{
		email: {
			required: true,
			type: String,
			unique: true,
			validate: {
				validator: function (value: string) {
					return emailRegex.test(value);
				},
				message: "Invalid email format",
			},
		},
		password: {
			required: true,
			type: String,
		},
		department: {
			type: String,
			required: true,
			enum: Object.values(Department),
		},
		accType: {
			type: String,
			required: true,
			enum: Object.values(AccountType),
		},
		position: [
			{
				type: String,
				required: true,
				enum: Object.values(NonTeachingStaffPosition),
			},
		],
		isProfileComplete: {
			default: false,
			type: Boolean,
		},
	},
	{
		timestamps: true,
	},
);

nonTeachingStaffSchema.pre("validate", async function (next) {
	try {
		if (this.position === undefined) {
			this.position = [];
		}

		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		if (this.position.length === 0) {
			throw new MongooseError(
				"Position for non teaching staff cannot be empty",
			);
		}

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const nonTeachingStaffModel: Model<INonTeachingStaffDocument> =
	model<INonTeachingStaffDocument>(
		"nonTeachingStaffModel",
		nonTeachingStaffSchema,
	);
