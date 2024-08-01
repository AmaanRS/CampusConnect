import { Model, MongooseError, Schema, model } from "mongoose";
import { AccountType, IAdminDocument, AdminPosition } from "../Types/ModelTypes";
import { emailRegex, validateAndHash } from "../Utils/util";

const adminSchema = new Schema<IAdminDocument>(
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
		accType: {
			type: String,
			required: true,
			enum: Object.values(AccountType.Admin),
		},
		position: [
			{
				type: String,
				required: true,
				enum: Object.values(AdminPosition),
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
// Middleware to validate and hash password before saving the user
adminSchema.pre("validate", async function (next) {
	try {
		if (this.position === undefined) {
			this.position = [];
		}

		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const adminModel: Model<IAdminDocument> = model<IAdminDocument>(
	"adminModel",
	adminSchema,
);
