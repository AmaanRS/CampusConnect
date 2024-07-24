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
		},
		year: {
			type: Number,
			enum: Object.values(Year).filter((v) => typeof v === "number"),
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
//There are too many problems on running update validators so understand carefully the problem before using update validators
// userSchema.pre("findOneAndUpdate", function (next) {
// 	this._mongooseOptions.runValidators = true;
// 	next();
// });


// The ones that have 'EXTRA' comment on top of them mean that some other conditional statements take care of the edge cases because of which their test cases cannot be written but i have kept it there to represent the logic and for safety
userSchema.pre("validate", function (next) {
	//If account type is not given and year or division or department or studentId or accType or position is set then throw ERROR
	if (
		!this.accType &&
		(this.year ||
			this.division ||
			this.department ||
			this.studentId ||
			this.position)
	) {
		const error = new MongooseError(
			"Account Type is required without which other optional fields cannot be set",
		);

		return next(error);
	}

	// YEAR constraints

	// If year is set then division, department, studentId should also be set
	// Other fields can be set or unset, other conditional statements will check that
	if (this.year && (!this.division || !this.department || !this.studentId)) {
		const error = new MongooseError(
			"If year is set then division, department, studentId should also be set",
		);

		return next(error);
	}

	// If year is set then position should not be set
	if (this.year && this.position) {
		const error = new MongooseError(
			"If year is set then position should not be set",
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
			"With Account Type as Admin, NonTeachingStaff, Teacher  year cannot be given",
		);
		return next(error);
	}

	// EXTRA
	//If the year is not a number throw error
	if (this.year && typeof this.year !== "number") {
		const error = new MongooseError("Year should be a number");
		return next(error);
	}

	// EXTRA
	//If the number is not between 1 to 4 throw error
	if (this.year && (this.year < 1 || this.year > 4)) {
		const error = new MongooseError("Year should be between 1 and 4");
		return next(error);
	}

	//DIVISION constraints

	// EXTRA
	// If division is set then year, department, studentId should be set and position should be unset
	if (
		this.division &&
		(!this.year || !this.department || !this.studentId || this.position)
	) {
		const error = new MongooseError(
			"If division is set then year, department, studentId should be set and position should be unset AND year should be a number between 1 and 4",
		);
		return next(error);
	}

	//If account type is not student and division is set then throw ERROR
	if (this.division && this.accType !== AccountType.Student) {
		const error = new MongooseError(
			"With Account Type as any other than Student division cannot be set",
		);
		return next(error);
	}

	// DEPARTMENT constraints

	// EXTRA
	// If department is set account type should be set
	if (this.department && !this.accType) {
		const error = new MongooseError(
			"If department is set account type should be set",
		);
		return next(error);
	}

	// STUDENTID constraints

	// EXTRA
	// If studentId is set then year, division, department should be set and position should be unset
	if (
		this.studentId &&
		(!this.year || !this.division || !this.department || this.position)
	) {
		const error = new MongooseError(
			"If studentId is set then year, division, department should be set and position should be unset",
		);
		return next(error);
	}

	// EXTRA
	//If account type is NOT student and studentId is set then throw ERROR
	if (this.studentId && this.accType !== AccountType.Student) {
		const error = new MongooseError(
			"With Account Type other than Student studentId cannot be set",
		);
		return next(error);
	}

	// ACCOUNTTYPE constraints

	// EXTRA
	// If account type is set department should also be set
	if (this.accType && !this.department) {
		const error = new MongooseError(
			"If account type is set department should also be set",
		);
		return next(error);
	}

	// If account type is student and position is set then throw ERROR
	if (this.accType === AccountType.Student && this.position) {
		const error = new MongooseError(
			"With Account Type as Student position cannot be set",
		);
		return next(error);
	}

	//If account type is non teaching staff and user schema's position is not lab Incharge then throw ERROR
	if (
		this.accType === AccountType.NonTeachingStaff &&
		this.position !== Position.LabIncharge
	) {
		const error = new MongooseError(
			"With Account Type as NonTeachingStaff position should be LabIncharge",
		);
		return next(error);
	}

	// EXTRA
	// If account type is not student then year, division, studentId cannot be set
	if (
		this.accType !== AccountType.Student &&
		(this.year || this.division || this.studentId)
	) {
		const error = new MongooseError(
			"If account type is not student then year, division, studentId cannot be set",
		);
		return next(error);
	}

	// EXTRA
	// If account type is admin and division is set then throw error
	if (this.accType === AccountType.Admin && this.division) {
		const error = new MongooseError(
			"With Account Type as Admin, division cannot be set",
		);
		return next(error);
	}

	// POSITION constraints

	// EXTRA
	// If position is set then department, account type should also be set
	if (this.position && !this.department && !this.accType) {
		const error = new MongooseError(
			"If position is set then department, account type should also be set",
		);
		return next(error);
	}

	// EXTRA
	// If position is set then year, division, studentId should not be set
	if (this.position && (!this.year || !this.division || !this.studentId)) {
		const error = new MongooseError(
			"If position is set then year, division, studentId should not be set",
		);
		return next(error);
	}

	next();
});

export const userModel: Model<IUserDocument> = model<IUserDocument>(
	"userModel",
	userSchema,
);
