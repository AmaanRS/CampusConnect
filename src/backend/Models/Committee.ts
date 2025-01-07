import { Model, MongooseError, Schema, model } from "mongoose";
import {
	College,
	CommitteeStatus,
	Department,
	ICommitteeDocument,
	ModelTypes,
} from "../Types/ModelTypes";
import { generateUniqueId } from "../Utils/uniqueId";
import { DataResponse } from "../Types/GeneralTypes";

const committeeSchema = new Schema<ICommitteeDocument>(
	{
		committeeId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		studentIncharge: {
			type: Schema.Types.ObjectId,
			ref: "userModel",
			required: true,
		},
		facultyIncharge: {
			type: Schema.Types.ObjectId,
			ref: "teacherModel",
			required: true,
		},
		facultyTeam: [
			{
				type: Schema.Types.ObjectId,
				ref: "teacherModel",
			},
		],
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "userModel",
			},
		],
		events: [
			{
				type: Schema.Types.ObjectId,
				ref: "eventModel",
			},
		],
		status: {
			type: String,
			required: true,
			default: CommitteeStatus.PENDING,
			enum: Object.values(CommitteeStatus),
		},
		// If committeeOfDepartment array length is greater than 1 then send committee creation request to admin else send it to respective hod
		// TEST NOW: If committee of Department is not arrray of array
		committeeOfDepartment: [
			{
				type: String,
				required: true,
				enum: [...Object.values(Department), ...Object.values(College)],
			},
		],
	},
	{
		timestamps: true,
	},
);

// Create crud api's fro this
// When studentIncharge is added add position student_incharge to that student's document
// When teacherIncharge/teamOfteacher is added add position FacultyIncharge/FacultyTeam to that teacher's document

committeeSchema.pre("validate", async function (next) {
	try {
		// If facultyTeam is given
		if (
			this.facultyIncharge &&
			this.facultyTeam &&
			this.facultyTeam.length !== 0
		) {
			this.facultyTeam.push(this.facultyIncharge);
		}
		// If facultyTeam is not given
		else if (this.facultyIncharge) {
			this.facultyTeam = [];
			this.facultyTeam.push(this.facultyIncharge);
		}

		// If members is given
		if (this.studentIncharge && this.members && this.members.length !== 0) {
			this.members.push(this.studentIncharge);
		}
		// If members is not given
		else if (this.studentIncharge) {
			this.members = [];
			this.members.push(this.studentIncharge);
		}

		// Validation check for empty arrays in the schema since mongoose allows empty array even though required true is written

		// Added a validation check for committeeOfDepartment only because rest of array fields are optional
		if (!Array.isArray(this.committeeOfDepartment)) {
			throw new MongooseError("CommitteeOfDepartment should be an array");
		}

		if (this.committeeOfDepartment.length < 1) {
			throw new MongooseError("There should be some committeeOfDepartment");
		}

		const hasCollege = this.committeeOfDepartment.some((v) =>
			Object.values(College).includes(v as unknown as College),
		);

		const hasDepartment = this.committeeOfDepartment.some((v) =>
			Object.values(Department).includes(v as Department),
		);

		if (hasCollege && hasDepartment) {
			throw new MongooseError(
				"Cannot have both College and Department in committeeOfDepartment.",
			);
		}

		if (!this.committeeId) {
			while (true) {
				const uniqueId = await generateUniqueId(ModelTypes.COMMITTEE_MODEL);
				if (uniqueId.success && "data" in uniqueId) {
					this.committeeId = (uniqueId as DataResponse).data as string;
					break;
				}
			}
		}

		this.facultyTeam = this.facultyTeam
			? [...new Set(this.facultyTeam)]
			: undefined;

		this.members = this.members ? [...new Set(this.members)] : undefined;

		this.events = this.events ? [...new Set(this.events)] : undefined;

		this.committeeOfDepartment = [...new Set(this.committeeOfDepartment)];
	} catch (err) {
		next(err as MongooseError);
	}
});

export const committeeModel: Model<ICommitteeDocument> = model<ICommitteeDocument>(
	"committeeModel",
	committeeSchema,
);
