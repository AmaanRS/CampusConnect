import { Model, MongooseError, Schema, model } from "mongoose";
import { AccountType, IAdminDocument, AdminPosition } from "../Types/ModelTypes";
import { userEmailRegex } from "../Utils/regexUtils";
import { validateAndHash } from "../Utils/passwordUtils";

const adminSchema = new Schema<IAdminDocument>(
	{
		email: {
			required: true,
			type: String,
			unique: true,
			validate: {
				validator: function (value: string) {
					return userEmailRegex.test(value);
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
			enum: Object.values(AccountType),
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

adminSchema.pre("validate", async function (next) {
	try {
		if (this.position === undefined) {
			this.position = [];
		}

		if (this.position.length === 0) {
			throw new MongooseError("Position for admin cannot be empty");
		}

		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		//By default
		this.isProfileComplete = false;

		this.accType = AccountType.Admin;

		this.position = [AdminPosition.Admin];

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

adminSchema.pre("save", async function (next) {
	try {
		// If all fields are given except the optional fields then set isProfileComplete to true
		if (this.email && this.password && this.accType && this.position) {
			this.isProfileComplete = true;
		}
		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const adminModel: Model<IAdminDocument> = model<IAdminDocument>(
	"adminModel",
	adminSchema,
);
