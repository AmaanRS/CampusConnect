import { Model, MongooseError, Schema, model } from "mongoose";
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
		isProfileComplete: {
			default: false,
			type: Boolean,
		},
		isAccountActive: {
			default: true,
			type: Boolean,
		},
		postsLiked: {
			type: [Schema.Types.ObjectId],
			ref: "postModel",
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

// function validatePosition(this: IStudent) {
// 	// User cannot give more than two positions but i am adding student to the positions set and it is not a bug
// 	// if (this.position.size > 2) {
// 	// 	throw new MongooseError(
// 	// 		"Do not give more than two positions while creating student",
// 	// 	);
// 	// }

// 	if (this.position === undefined) {
// 		throw new MongooseError("Position cannot be empty");
// 	}

// 	if (this.position.length === 1) {
// 		validateSinglePosition(this);
// 	} else if (this.position.length === 2) {
// 		validateMultiplePositions(this);
// 	} else if (
// 		this.position.length > 2 &&
// 		this.position.length !== Object.keys(StudentPosition).length
// 	) {
// 		throw new MongooseError(
// 			"Add validations for student positions because you increased the keys in Student Position enum but did not write a validation for it",
// 		);
// 	}
// }

// function validateSinglePosition(student: IStudent) {
// 	const position = [...student.position][0];

// 	switch (position) {
// 		case StudentPosition.Student:
// 			if (
// 				//If isInChargeOfCommittees is given
// 				(student.isInChargeOfCommittees &&
// 					student.isInChargeOfCommittees?.length > 0) ||
// 				//If isMemberOfCommittees is given
// 				(student.isMemberOfCommittees &&
// 					student.isMemberOfCommittees?.length > 0)
// 			) {
// 				throw new MongooseError(
// 					"If position is student then isInChargeOfCommittees and isMemberOfCommittees cannot be given",
// 				);
// 			}
// 			break;
// 		case StudentPosition.StudentIncharge:
// 			// Add position student to the set of positions since a studentincharge is also a student
// 			student.position.push(StudentPosition.Student);

// 			if (
// 				//If isMemberOfCommittees is given
// 				(student.isMemberOfCommittees &&
// 					student.isMemberOfCommittees?.length > 0) ||
// 				//If isInChargeOfCommittees is not given
// 				(student.isInChargeOfCommittees &&
// 					student.isInChargeOfCommittees?.length <= 0)
// 			) {
// 				throw new MongooseError(
// 					"If position is StudentIncharge then isMemberOfCommittees cannot be given and isInChargeOfCommittees should be given",
// 				);
// 			}
// 			break;
// 		case StudentPosition.CommitteeMember:
// 			// Add position student to the set of positions since a CommitteeMember is also a student
// 			student.position.push(StudentPosition.Student);

// 			if (
// 				//If isInChargeOfCommittees is given
// 				(student.isInChargeOfCommittees &&
// 					student.isInChargeOfCommittees.length > 0) ||
// 				//If isMemberOfCommittees is not given
// 				(student.isMemberOfCommittees &&
// 					student.isMemberOfCommittees.length <= 0)
// 			) {
// 				throw new MongooseError(
// 					"If position is CommitteeMember then isInChargeOfCommittees cannot be given and isMemberOfCommittees should be given",
// 				);
// 			}
// 			break;
// 		default:
// 			throw new MongooseError("Invalid student position");
// 	}
// }

// //
// // Check the below code if it works or not, it may not because of "this"
// //
// function validateMultiplePositions(student: IStudent) {
// 	const { position, isInChargeOfCommittees, isMemberOfCommittees } = student;

// 	// Add position student to the set of positions since a StudentIncharge and CommitteeMember is also a student
// 	student.position.push(StudentPosition.Student);

// 	// Check this if it works
// 	if (
// 		position.includes(StudentPosition.StudentIncharge) &&
// 		position.includes(StudentPosition.CommitteeMember) &&
// 		((isInChargeOfCommittees && isInChargeOfCommittees.length <= 0) ||
// 			(isMemberOfCommittees && isMemberOfCommittees.length <= 0))
// 	) {
// 		throw new MongooseError(
// 			"If position is both StudentIncharge and CommitteeMember, then both isInChargeOfCommittees and isMemberOfCommittees should be given",
// 		);
// 	}
// }

// export function validCombinationsFunc(value: string[]) {
// 	const allowedCombinations: string[][] = [
// 		[StudentPosition.Student],
// 		[StudentPosition.Student, StudentPosition.CommitteeMember],
// 		[
// 			StudentPosition.Student,
// 			StudentPosition.CommitteeMember,
// 			StudentPosition.StudentIncharge,
// 		],
// 	];
// 	return allowedCombinations.some(
// 		(combination) =>
// 			combination.every((pos) => value.includes(pos)) &&
// 			value.every((pos) => combination.includes(pos)),
// 	);
// }

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

		if (this.postsLiked === undefined) this.postsLiked = [];

		// this.isInChargeOfCommittees = this.isInChargeOfCommittees
		// 	? [...new Set(this.isInChargeOfCommittees)]
		// 	: undefined;

		// this.isMemberOfCommittees = this.isMemberOfCommittees
		// 	? [...new Set(this.isMemberOfCommittees)]
		// 	: undefined;

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
