import { Model, MongooseError, Schema, model } from "mongoose";
import {
	Department,
	AccountType,
	ITeacherDocument,
	TeacherPosition,
} from "../Types/ModelTypes";
import { teacherEmailRegex, validateAndHash } from "../Utils/util";

const teacherSchema = new Schema<ITeacherDocument>(
	{
		email: {
			required: true,
			type: String,
			unique: true,
			validate: {
				validator: function (value: string) {
					return teacherEmailRegex.test(value);
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
				enum: Object.values(TeacherPosition),
			},
		],
		isInChargeOfCommittees: [
			{
				type: Schema.Types.ObjectId,
				ref: "committeeModel",
			},
		],
		isInTeamOfCommittees: [
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

teacherSchema.pre("validate", async function (next) {
	try {
		if (this.position === undefined) {
			this.position = [];
		}

		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		if (this.position.length === 0) {
			throw new MongooseError("Position for Teacher cannot be empty");
		}

		// If faculty incharge is given as position then add isInChargeOfCommittees to isInTeamOfCommittees
		if (
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.isInChargeOfCommittees?.length !== 0
		) {
			for (
				let index = 0;
				index < this.isInChargeOfCommittees?.length!;
				index++
			) {
				this.isInTeamOfCommittees?.push(this.isInChargeOfCommittees![index]);
			}
		}

		// If position is teacher and isInChargeOfCommittees or isInTeamOfCommittees is given, throw error
		if (
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.length === 1 &&
			(this.isInChargeOfCommittees?.length !== 0 ||
				this.isInTeamOfCommittees?.length !== 0)
		) {
			throw new MongooseError(
				"With position as teacher, isInChargeOfCommittees or isInTeamOfCommittees cannot be given",
			);
		}

		// If position is HOD and isInChargeOfCommittees or isInTeamOfCommittees is given, throw error
		if (
			this.position.includes(TeacherPosition.HOD) &&
			this.position.length === 1 &&
			(this.isInChargeOfCommittees?.length !== 0 ||
				this.isInTeamOfCommittees?.length !== 0)
		) {
			throw new MongooseError(
				"With position as HOD, isInChargeOfCommittees or isInTeamOfCommittees cannot be given",
			);
		}

		// If position is only FacultyIncharge, throw error
		if (
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.length === 1
		) {
			throw new MongooseError(
				"Only FacultyIncharge as position cannot be given",
			);
		}

		// If position is only FacultyTeam, throw error
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.length === 1
		) {
			throw new MongooseError("Only FacultyTeam as position cannot be given");
		}

		// If position is both HOD and Teacher, and isInChargeOfCommittees or isInTeamOfCommittees is given, throw error
		if (
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.length === 2 &&
			(this.isInChargeOfCommittees?.length !== 0 ||
				this.isInTeamOfCommittees?.length !== 0)
		) {
			throw new MongooseError(
				"With positions HOD and Teacher, isInChargeOfCommittees and isInTeamOfCommittees cannot be given",
			);
		}

		// If position is both Teacher and FacultyIncharge, and isInChargeOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.length === 2 &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions Teacher and FacultyIncharge, isInChargeOfCommittees should be given",
			);
		}

		// If position is both HOD and FacultyIncharge, and isInChargeOfCommittees , throw error
		if (
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.length === 2 &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions HOD and FacultyIncharge, isInChargeOfCommittees should be given",
			);
		}

		// If position is HOD, FacultyIncharge, and Teacher, and isInChargeOfCommittees or isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.length === 3 &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions HOD, FacultyIncharge, and Teacher, isInChargeOfCommittees should be given",
			);
		}

		// If position is both Teacher and FacultyTeam, and isInChargeOfCommittees is given or isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.length === 2 &&
			(this.isInChargeOfCommittees?.length !== 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions Teacher and FacultyTeam, isInChargeOfCommittees cannot be given and isInTeamOfCommittees should be given",
			);
		}

		// If position is both HOD and FacultyTeam, and isInChargeOfCommittees is given or isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.length === 2 &&
			(this.isInChargeOfCommittees?.length !== 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions HOD and FacultyTeam, isInChargeOfCommittees cannot be given and isInTeamOfCommittees should be given",
			);
		}

		// If the position includes either FacultyTeam or FacultyIncharge, and does not include either HOD and Teacher, throw an error
		if (
			(this.position.includes(TeacherPosition.FacultyTeam) ||
				this.position.includes(TeacherPosition.FacultyIncharge)) &&
			!this.position.includes(TeacherPosition.HOD) &&
			!this.position.includes(TeacherPosition.Teacher)
		) {
			throw new MongooseError(
				"With positions as FacultyTeam or FacultyIncharge either HOD and Teacher must be given",
			);
		}

		if (
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.length === 3 &&
			(this.isInChargeOfCommittees?.length !== 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			// If position is HOD, Teacher, and FacultyTeam, and isInChargeOfCommittees is given or isInTeamOfCommittees is not given, throw error
			throw new MongooseError(
				"With positions HOD, Teacher, and FacultyTeam, isInChargeOfCommittees cannot be given and isInTeamOfCommittees should be given",
			);
		}

		// If position is FacultyTeam, Teacher, and FacultyIncharge, and isInChargeOfCommittees is not given or isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.length === 3 &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions FacultyTeam, Teacher, and FacultyIncharge, isInChargeOfCommittees should be given and isInTeamOfCommittees should be given",
			);
		}

		// If position is FacultyTeam, HOD, and FacultyIncharge, and isInChargeOfCommittees is not given or isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.length === 3 &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions FacultyTeam, HOD, and FacultyIncharge, isInChargeOfCommittees should be given and isInTeamOfCommittees should be given",
			);
		}

		// If position is FacultyTeam, HOD, Teacher, and FacultyIncharge, and isInChargeOfCommittees is not given or isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.includes(TeacherPosition.HOD) &&
			this.position.includes(TeacherPosition.Teacher) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.length === 4 &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions FacultyTeam, HOD, Teacher, and FacultyIncharge, isInChargeOfCommittees should be given and isInTeamOfCommittees should be given",
			);
		}

		// If position is FacultyTeam and FacultyIncharge and HOD/Teacher is not given, and isInChargeOfCommittees and isInTeamOfCommittees is not given, throw error
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			!this.position.includes(TeacherPosition.HOD) &&
			!this.position.includes(TeacherPosition.Teacher) &&
			(this.isInChargeOfCommittees?.length === 0 ||
				this.isInTeamOfCommittees?.length === 0)
		) {
			throw new MongooseError(
				"With positions FacultyTeam and FacultyIncharge, HOD or Teacher must be given and isInChargeOfCommittees and isInTeamOfCommittees should not be empty",
			);
		}

		// If position is HOD add teacher to the position array
		if (this.position.includes(TeacherPosition.HOD)) {
			this.position.push(TeacherPosition.Teacher);
		}

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		this.isInChargeOfCommittees = this.isInChargeOfCommittees
			? [...new Set(this.isInChargeOfCommittees)]
			: undefined;

		this.isInTeamOfCommittees = this.isInTeamOfCommittees
			? [...new Set(this.isInTeamOfCommittees)]
			: undefined;

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const teacherModel: Model<ITeacherDocument> = model<ITeacherDocument>(
	"teacherModel",
	teacherSchema,
);
