import { Model, MongooseError, Schema, model } from "mongoose";
import {
	Year,
	Department,
	AccountType,
	IStudentDocument,
	StudentPosition,
	IStudent,
} from "../Types/ModelTypes";
import { studentEmailRegex, validateAndHash } from "../Utils/util";

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
		position: [
			{
				type: String,
				required: true,
				enum: Object.values(StudentPosition),
			},
		],
		isInChargeOfCommittees: [
			{
				type: Schema.Types.ObjectId,
				ref: "committeeModel",
			},
		],
		isMemberOfCommittees: [
			{
				type: Schema.Types.ObjectId,
				ref: "committeeModel",
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

function validatePosition(this: IStudent) {
	// User cannot give more than two positions but i am adding student to the positions set and it is not a bug
	// if (this.position.size > 2) {
	// 	throw new MongooseError(
	// 		"Do not give more than two positions while creating student",
	// 	);
	// }

	if (this.position === undefined) {
		throw new MongooseError("Position cannot be empty");
	}

	if (this.position.length === 1) {
		validateSinglePosition(this);
	} else if (this.position.length === 2) {
		validateMultiplePositions(this);
	} else if (
		this.position.length > 2 &&
		this.position.length !== Object.keys(StudentPosition).length
	) {
		throw new MongooseError(
			"Add validations for student positions because you increased the keys in Student Position enum but did not write a validation for it",
		);
	}
}

function validateSinglePosition(student: IStudent) {
	const position = [...student.position][0];

	switch (position) {
		case StudentPosition.Student:
			if (
				//If isInChargeOfCommittees is given
				(student.isInChargeOfCommittees &&
					student.isInChargeOfCommittees?.length > 0) ||
				//If isMemberOfCommittees is given
				(student.isMemberOfCommittees &&
					student.isMemberOfCommittees?.length > 0)
			) {
				throw new MongooseError(
					"If position is student then isInChargeOfCommittees and isMemberOfCommittees cannot be given",
				);
			}
			break;
		case StudentPosition.StudentIncharge:
			// Add position student to the set of positions since a studentincharge is also a student
			student.position.push(StudentPosition.Student);

			if (
				//If isMemberOfCommittees is given
				(student.isMemberOfCommittees &&
					student.isMemberOfCommittees?.length > 0) ||
				//If isInChargeOfCommittees is not given
				(student.isInChargeOfCommittees &&
					student.isInChargeOfCommittees?.length <= 0)
			) {
				throw new MongooseError(
					"If position is StudentIncharge then isMemberOfCommittees cannot be given and isInChargeOfCommittees should be given",
				);
			}
			break;
		case StudentPosition.CommitteeMember:
			// Add position student to the set of positions since a CommitteeMember is also a student
			student.position.push(StudentPosition.Student);

			if (
				//If isInChargeOfCommittees is given
				(student.isInChargeOfCommittees &&
					student.isInChargeOfCommittees.length > 0) ||
				//If isMemberOfCommittees is not given
				(student.isMemberOfCommittees &&
					student.isMemberOfCommittees.length <= 0)
			) {
				throw new MongooseError(
					"If position is CommitteeMember then isInChargeOfCommittees cannot be given and isMemberOfCommittees should be given",
				);
			}
			break;
		default:
			break;
	}
}

//
// Check the below code if it works or not, it may not because of "this"
//
function validateMultiplePositions(student: IStudent) {
	const { position, isInChargeOfCommittees, isMemberOfCommittees } = student;

	// Add position student to the set of positions since a StudentIncharge and CommitteeMember is also a student
	student.position.push(StudentPosition.Student);

	// Check this if it works
	if (
		position.includes(StudentPosition.StudentIncharge) &&
		position.includes(StudentPosition.CommitteeMember) &&
		((isInChargeOfCommittees && isInChargeOfCommittees.length <= 0) ||
			(isMemberOfCommittees && isMemberOfCommittees.length <= 0))
	) {
		throw new MongooseError(
			"If position is both StudentIncharge and CommitteeMember, then both isInChargeOfCommittees and isMemberOfCommittees should be given",
		);
	}
}

studentSchema.pre("validate", async function (next) {
	try {
		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		if (this.position.length === 0) {
			throw new MongooseError("Position for student cannot be empty");
		}

		validatePosition.call(this);

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		this.isInChargeOfCommittees = this.isInChargeOfCommittees
			? [...new Set(this.isInChargeOfCommittees)]
			: undefined;
		this.isMemberOfCommittees = this.isMemberOfCommittees
			? [...new Set(this.isMemberOfCommittees)]
			: undefined;

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const studentModel: Model<IStudentDocument> = model<IStudentDocument>(
	"studentModel",
	studentSchema,
);
