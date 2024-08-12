import { Model, MongooseError, Schema, model } from "mongoose";
import {
	AccountType,
	Department,
	IUserDocument,
	StudentPosition,
	TeacherPosition,
} from "../Types/ModelTypes";
import { userEmailRegex } from "../Utils/regexUtils";
import { validateAndHash } from "../Utils/passwordUtils";

const userSchema = new Schema<IUserDocument>(
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
		department: {
			type: String,
			enum: Object.values(Department),
		},
		accType: {
			type: String,
			enum: Object.values(AccountType),
		},
		position: [
			{
				type: String,
				required: true,
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

//
// For admin and non-teaching staff, logic is not specified (I dont know) for now admin will be hard coded and non-teaching staff will be same as teacher
//
userSchema.pre("validate", async function (next) {
	try {
		// Clear account types and positions from the data before processing, since these two are decided programatically

		// @ts-ignore
		this.accType = undefined;
		// @ts-ignore
		this.position = undefined;
		this.department = undefined;

		if (!userEmailRegex.test(this.email)) {
			throw new MongooseError("The email should be a vcet email");
		}

		//throws Mongoose error it something wrong
		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		// Decide what will be the account type based on the email
		const emailPartsArr = this.email.split("@");
		if (emailPartsArr[1] !== "vcet.edu.in") {
			throw new MongooseError("The email should be a vcet email");
		}

		const emailPrefix = emailPartsArr[0];

		// If the prefix does not contain . or _ throw error
		if (
			(!emailPrefix.includes(".") && !emailPrefix.includes("_")) ||
			(emailPrefix.includes(".") && emailPrefix.includes("_"))
		) {
			throw new MongooseError("The email should be a vcet email");
		}

		// HOD email format: hod_it@vcet.edu.in
		if (emailPrefix.startsWith("hod_")) {
			const departmentPart = emailPrefix.split("_")[1];

			// The department part should be a valid string
			if (
				typeof departmentPart !== "string" ||
				!Number.isNaN(Number(departmentPart))
			) {
				throw new MongooseError("Give a valid vcet email");
			}

			// Assign HOD position and account type
			this.position = [TeacherPosition.HOD];
			this.accType = AccountType.Teacher;

			// Assign department
			// @ts-ignore // This is important
			this.department = Department[departmentPart.toUpperCase()];

			if (this.department === undefined) {
				throw new MongooseError("Give a valid vcet email");
			}
		}
		// Student email format: an.212254101@vcet.edu.in
		// The second part should be a number
		else if (!Number.isNaN(Number(emailPrefix.split(".")[1]))) {
			const firstPart = emailPrefix.split(".")[0];
			const secondPart = emailPrefix.split(".")[1];

			// Validate first and second parts
			if (!firstPart || !secondPart) {
				throw new MongooseError("Give a valid vcet email");
			}

			// The first part should be a string
			if (typeof firstPart !== "string" || !Number.isNaN(Number(firstPart))) {
				throw new MongooseError("Give a valid vcet email");
			}

			// The second part should be a 9-digit number
			if (secondPart.length !== 9) {
				throw new MongooseError("Give a valid vcet email");
			}

			// Assign student position and account type
			this.position = [StudentPosition.Student];
			this.accType = AccountType.Student;
		}
		// Teacher email format: ash.van@vcet.edu.in
		// The second part should be a string
		else if (
			typeof emailPrefix.split(".")[1] === "string" &&
			Number.isNaN(Number(emailPrefix.split(".")[1])) &&
			!emailPrefix.includes("_")
		) {
			if (
				emailPrefix.split(".")[0].length === 0 ||
				emailPrefix.split(".")[1].length === 0
			) {
				throw new MongooseError("Give a valid vcet email");
			}
			// Assign teacher position and account type
			this.position = [TeacherPosition.Teacher];
			this.accType = AccountType.Teacher;
		} else {
			throw new MongooseError("There is some problem with the given email");
		}

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const userModel: Model<IUserDocument> = model<IUserDocument>(
	"userModel",
	userSchema,
);
