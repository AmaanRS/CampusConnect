import { Model, MongooseError, Schema, model } from "mongoose";
import {
	Department,
	AccountType,
	ITeacherDocument,
	TeacherPosition,
} from "../Types/ModelTypes";
import { emailRegex, validateAndHash } from "../Utils/util";

const teacherSchema = new Schema<ITeacherDocument>(
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
			enum: Object.values(AccountType.Teacher),
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

		// If position includes FacultyIncharge and FacultyTeam, and no other positions then data cannot be stored
		if (
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			this.position.includes(TeacherPosition.FacultyTeam) &&
			!this.position.includes(TeacherPosition.HOD) &&
			!this.position.includes(TeacherPosition.Teacher)
		) {
			throw new MongooseError(
				"Cannot give only FacultyIncharge and FacultyTeam as Teacher's position",
			);
		}

		// If only Hod is given as position then add teacher
		if (this.position.includes(TeacherPosition.HOD)) {
			this.position.push(TeacherPosition.Teacher);
		}
		// If FacultyIncharge is given then teacher/hod should also be given
		if (
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			(!this.position.includes(TeacherPosition.HOD) ||
				!this.position.includes(TeacherPosition.Teacher))
		) {
			throw new MongooseError(
				"If FacultyIncharge is given then teacher/hod should also be given",
			);
		}
		// If FacultyTeam is given then teacher/hod should also be given
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			(!this.position.includes(TeacherPosition.HOD) ||
				!this.position.includes(TeacherPosition.Teacher))
		) {
			throw new MongooseError(
				"If FacultyTeam is given then teacher/hod should also be given",
			);
		}

		// If FacultyIncharge is given then only isInChargeOfCommittees is allowed
		if (
			this.position.includes(TeacherPosition.FacultyIncharge) &&
			(!this.isInChargeOfCommittees || this.isInTeamOfCommittees)
		) {
			throw new MongooseError(
				"If FacultyIncharge is given then only isInChargeOfCommittees is allowed",
			);
		}
		// If FacultyTeam is given then only isInTeamOfCommittees is allowed
		if (
			this.position.includes(TeacherPosition.FacultyTeam) &&
			(!this.isInTeamOfCommittees || this.isInChargeOfCommittees)
		) {
			throw new MongooseError(
				"If FacultyTeam is given then only isInTeamOfCommittees is allowed",
			);
		}

		// Converted set to array because i need position to be unique but mongodb supports array not set
		this.position = [...new Set(this.position)];

		this.isInChargeOfCommittees = [...new Set(this.isInChargeOfCommittees)];

		this.isInTeamOfCommittees = [...new Set(this.isInTeamOfCommittees)];

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

export const teacherModel: Model<ITeacherDocument> = model<ITeacherDocument>(
	"teacherModel",
	teacherSchema,
);
