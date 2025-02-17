import { Model, MongooseError, Schema, Types, model } from "mongoose";
import {
	Year,
	Department,
	AccountType,
	IStudentDocument,
	StudentPosition,
} from "../Types/ModelTypes";
import { studentEmailRegex } from "../Utils/regexUtils";
import { validateAndHash } from "../Utils/passwordUtils";
import _ from "lodash";

const studentSchema = new Schema<IStudentDocument>(
	{
		email: {
			required: true,
			type: String,
			unique: true,
			validate: {
				validator: function (value: string) {
					return studentEmailRegex.test(value);
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
			required: true,
			enum: Object.values(Year).filter((v) => typeof v === "number"),
		},
		department: {
			type: String,
			required: true,
			enum: Object.values(Department),
		},
		studentId: {
			type: Number,
			required: true,
			validate: {
				validator: function (value: number) {
					return value >= 100000000 && value <= 999999999;
				},
				message: "Invalid student ID format.",
			},
		},
		accType: {
			type: String,
			required: true,
			enum: Object.values(AccountType),
		},
		// Replaced the position,isInChargeOfCommittees,isMemberOfCommittees with this and rest of the code in pre hook
		//Use this standard method while defining schema
		committeePositions: {
			type: [
				{
					committeeObjId: {
						type: Schema.Types.ObjectId,
						required: true,
						ref: "committeeModel",
					},
					position: {
						type: String,
						required: true,
						enum: Object.values(StudentPosition),
					},
				},
			],
			default: [],
		},
		followingCommittees: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "committeeModel",
				},
			],
			default: [],
		},
		isProfileComplete: {
			default: false,
			type: Boolean,
		},
		isAccountActive: {
			default: true,
			type: Boolean,
		},
		postsLiked: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "postModel",
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

studentSchema.pre("validate", async function (next) {
	try {
		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		if (
			this.committeePositions &&
			Array.isArray(this.committeePositions) &&
			this.committeePositions.length !== 0
		) {
			for (let i = 0; i < this.committeePositions.length; i++) {
				//Validate structure of object within the array
				if (
					!("committeeObjId" in this.committeePositions[i]) ||
					!("position" in this.committeePositions[i])
				) {
					throw new MongooseError(
						"Give both committeeObjId and positions in the committee",
					);
				}
			}

			// To get unique objects in the array
			this.committeePositions = _.uniqBy(
				this.committeePositions,
				"committeeObjId",
			);
		}

		//By default
		this.isProfileComplete = false;

		// validatePosition.call(this);

		this.accType = AccountType.Student;

		// Get the studentId from email
		const stuId = Number(this.email.split("@")[0].split(".")[1]);

		if (!Number.isInteger(stuId)) {
			throw new MongooseError(
				"Send the correct email id cannot recognize the student id",
			);
		}

		this.studentId = stuId;

		this.followingCommittees = _.chain(this.followingCommittees)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();

		this.postsLiked = _.chain(this.postsLiked)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

// Hooks for which inactive student will not be returned
const hooks = [
	"find",
	"findOne",
	"findOneAndUpdate",
	"deleteOne",
	"deleteMany",
	"updateOne",
	"updateMany",
] as const;

// Programatically adds condition to remove inactive students from the query result
// When inactive students are also needed and should not be excluded set _skipInactiveStudentsHook
// If in some place this code gives error then set _skipInactiveStudentsHook as true
hooks.forEach(function (hook) {
	studentSchema.pre(hook, function (next) {
		const options = this.getOptions();
		const query = this.getQuery();

		// _skipInactiveStudentsHook; flag when true, will allow hooks to show inactive students
		if (options && !options["_skipInactiveStudentsHook"]) {
			// If "isAccountActive" already exists as an object
			if (
				query["isAccountActive"] &&
				typeof query["isAccountActive"] === "object"
			) {
				if (query["isAccountActive"]["$nin"]) {
					// Add false to $nin if it doesn't already exist
					if (!query["status"]["$nin"].includes(false)) {
						query["status"]["$nin"].push(false);
					}
				} else {
					query["isAccountActive"]["$nin"] = [false];
				}
			} else {
				// If "status" doesn't exist, create $nin with false
				query["isAccountActive"] = { $ne: false };
			}
		}
		next();
	});
});

studentSchema.pre("save", async function (next) {
	try {
		// If all fields are given except the optional fields then set isProfileComplete to true
		if (
			this.email &&
			this.password &&
			this.department &&
			this.year &&
			this.studentId &&
			this.accType
		) {
			this.isProfileComplete = true;
		}

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const studentModel: Model<IStudentDocument> = model<IStudentDocument>(
	"studentModel",
	studentSchema,
);
