import { Model, MongooseError, Schema, model } from "mongoose";
import {
	Year,
	Department,
	AccountType,
	Position,
	IUserDocument,
} from "../BackendTypes";

const userSchema = new Schema<IUserDocument>(
	{
		username: {
			required: true,
			type: String,
			trim: true,
			minlength: 1,
		},
		email: {
			required: true,
			type: String,
			unique: true,
			validate: {
				validator: function (value: string) {
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
				},
				message: "Invalid email format",
			},
		},
		password: {
			required: true,
			type: String,
			validate: {
				validator: function (value: string) {
					const passwordRegex =
						/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
					return passwordRegex.test(value);
				},
				message:
					"Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long.",
			},
		},
		year: {
			type: Number,
			enum: Object.values(Year),
		},
		division: {
			type: String,
			validate: {
				validator: function (value: string) {
					return value.length === 1 && /^[A-Z]+$/.test(value);
				},
				message: "Division must be a single uppercase letter",
			},
		},
		department: {
			type: String,
			enum: Object.values(Department),
		},
		studentId: {
			type: Number,
			validate: {
				validator: function (value: number) {
					return value >= 100000000 && value <= 999999999;
				},
				message: "Invalid student ID format.",
			},
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
			default: false,
			type: Boolean,
		},
	},
	{
		timestamps: true,
	},
);

//Test for this is left Write it in github issues
userSchema.pre("findOneAndUpdate", function (next) {
	this._mongooseOptions.runValidators = true;
	next();
});

userSchema.pre("validate", function (next) {
	// If account type is student and position is set then throw ERROR
	if (this.accType === AccountType.Student && this.position) {
		const error = new MongooseError(
			"With Account Type as Student position cannot be set",
		);
		return next(error);
	}
	//If account type is admin and division is set then throw ERROR
	else if (this.accType == AccountType.Admin && this.division) {
		const error = new MongooseError(
			"With Account Type as Admin division cannot be set",
		);
		return next(error);
	}
	//If account type is non teaching staff and user schema's position is not lab Incharge then throw ERROR
	else if (
		this.accType === AccountType.NonTeachingStaff &&
		this.position !== Position.LabIncharge
	) {
		const error = new MongooseError(
			"With Account Type as NonTeachingStaff position should be LabIncharge",
		);
		return next(error);
	}

	//If account type is admin or teacher or non-teaching staff and user schema's year is set then throw ERROR
	if (
		(this.accType === AccountType.Admin ||
			this.accType === AccountType.NonTeachingStaff ||
			this.accType === AccountType.Teacher) &&
		this.year
	) {
		const error = new MongooseError(
			"With Account Type as Admin, NonTeachingStaff, Teacher position year cannot be given",
		);
		return next(error);
	}

	//If account type is NOT student and studentId is set then throw ERROR
	if (this.accType !== AccountType.Student && this.studentId) {
		const error = new MongooseError(
			"With Account Type other than Student studentId cannot be set",
		);
		return next(error);
	}

	//If account type is not given and year or division or department or studentId or accType or position is set then throw ERROR
	//delete does not throws an error if the property does not exist
	if (
		!this.accType &&
		(this.year ||
			this.division ||
			this.department ||
			this.studentId ||
			this.accType ||
			this.position)
	) {
		const error = new MongooseError(
			"Account Type is required without which other optional fields cannot be set",
		);

		return next(error);
	}

	next();
});

export const userModel: Model<IUserDocument> = model<IUserDocument>(
	"userModel",
	userSchema,
);
