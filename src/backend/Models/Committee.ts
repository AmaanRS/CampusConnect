import { Model, MongooseError, Schema, model } from "mongoose";
import { Department, ICommitteeDocument } from "../Types/ModelTypes";
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
		isAccountActive: {
			type: Boolean,
			default: false,
		},
		// If committeeOfDepartment array length is greater than 1 then send committee creation request to admin else send it to respective hod
		committeeOfDepartment: [
			{
				type: String,
				enum: Object.values(Department),
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

		if (!this.committeeId) {
			while (true) {
				const uniqueId = await generateUniqueId();
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
	} catch (err) {
		next(err as MongooseError);
	}
});

export const committeeModel: Model<ICommitteeDocument> = model<ICommitteeDocument>(
	"committeeModel",
	committeeSchema,
);
