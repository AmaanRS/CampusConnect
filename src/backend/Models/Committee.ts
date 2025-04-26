import { Model, MongooseError, Schema, Types, model } from "mongoose";
import {
	College,
	CommitteeStatus,
	Department,
	ICommitteeDocument,
	ModelTypes,
	Tags,
} from "../Types/ModelTypes";
import { generateUniqueId } from "../Utils/uniqueId";
import { DataResponse } from "../Types/GeneralTypes";
import _ from "lodash";

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
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		studentIncharge: {
			type: Schema.Types.ObjectId,
			ref: "studentModel",
			required: true,
		},
		facultyIncharge: {
			type: Schema.Types.ObjectId,
			ref: "teacherModel",
			required: true,
		},
		facultyTeam: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "teacherModel",
				},
			],
			default: [],
		},
		members: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "userModel",
				},
			],
			default: [],
		},
		events: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "eventModel",
				},
			],
			default: [],
		},
		posts: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "postModel",
				},
			],
			default: [],
		},
		status: {
			type: String,
			required: true,
			default: CommitteeStatus.PENDING,
			enum: Object.values(CommitteeStatus),
		},
		committeeOfDepartment: [
			{
				type: String,
				required: true,
				enum: [...Object.values(Department), ...Object.values(College)],
			},
		],
		followers: {
			type: [
				{
					userId: {
						type: Schema.Types.ObjectId,
						required: true,
						refPath: "followers.userType",
					},
					userType: {
						type: String,
						required: true,
						enum: Object.values(ModelTypes),
					},
				},
			],
			default: [],
		},
		tags: {
			type: [
				{
					type: String,
					enum: Object.values(Tags),
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);
// TODO: For some reason there are duplicate entries in members and facultyTeam
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

		if (
			this.posts &&
			(!Array.isArray(this.posts) ||
				this.posts.some((post) => !Types.ObjectId.isValid(post)))
		) {
			return next(new MongooseError("Invalid ObjectId in posts array"));
		}

		this.facultyTeam = _.chain(this.facultyTeam)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();

		this.members = _.chain(this.members)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();

		this.events = _.chain(this.events)
			.map(String)
			.uniq()
			.map((id) => new Types.ObjectId(id))
			.value();

		this.followers = _.chain(this.followers)
			.map((follower) => ({
				userId: follower.userId.toString(),
				userType: follower.userType,
			}))
			.uniqBy("userId")
			.map((follower) => ({
				userId: new Types.ObjectId(follower.userId),
				userType: follower.userType,
			}))
			.value();

		this.committeeOfDepartment = [...new Set(this.committeeOfDepartment)];

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

// If the status of committee is pending/deleted do not show the committee in find

// Hooks for which pending and deleted committees will not be returned
const hooks = [
	"find",
	"findOne",
	"findOneAndUpdate",
	"deleteOne",
	"deleteMany",
	"updateOne",
	"updateMany",
] as const;

// Programatically adds condition to remove pending and deleted committees from the query result
// When in need of only one of the conditions, set both flags true then add the condition you want (ie if only pending committees are needed then set both flags true and add Committee status pending)
// If you want to use any other condition besides pending/deleted then set both flags true and add the condition
hooks.forEach(function (hook) {
	committeeSchema.pre(hook, function (next) {
		const options = this.getOptions();
		const query = this.getQuery();

		// _skipPendingInFindHook; flag when true, will allow hooks to show pending committees
		if (options && !options["_skipPendingCheckInHook"]) {
			// If "status" already exists as an object
			if (query["status"] && typeof query["status"] === "object") {
				if (query["status"]["$nin"]) {
					// Add PENDING to $nin if it doesn't already exist
					if (!query["status"]["$nin"].includes(CommitteeStatus.PENDING)) {
						query["status"]["$nin"].push(CommitteeStatus.PENDING);
					}
				} else {
					// Convert $ne or other objects to $nin
					query["status"]["$nin"] = [CommitteeStatus.PENDING];
				}
			} else if (!query["status"]) {
				// If "status" doesn't exist, create $nin with PENDING
				query["status"] = { $nin: [CommitteeStatus.PENDING] };
			} else {
				// If "status" exists as a non-object, wrap it with $nin
				query["status"] = {
					$nin: [query["status"], CommitteeStatus.PENDING],
				};
			}
		}

		// _skipDeletingInFindHook; flag when true, will allow hooks to show deleted committees
		if (options && !options["_skipDeletingCheckInHook"]) {
			// If "status" already exists as an object
			if (query["status"] && typeof query["status"] === "object") {
				if (query["status"]["$nin"]) {
					// Add PENDING to $nin if it doesn't already exist
					if (!query["status"]["$nin"].includes(CommitteeStatus.DELETED)) {
						query["status"]["$nin"].push(CommitteeStatus.DELETED);
					}
				} else {
					// Convert $ne or other objects to $nin
					query["status"]["$nin"] = [CommitteeStatus.DELETED];
				}
			} else if (!query["status"]) {
				// If "status" doesn't exist, create $nin with PENDING
				query["status"] = { $nin: [CommitteeStatus.DELETED] };
			} else {
				// If "status" exists as a non-object, wrap it with $nin
				query["status"] = {
					$nin: [query["status"], CommitteeStatus.DELETED],
				};
			}
		}
		next();
	});
});

export const committeeModel: Model<ICommitteeDocument> = model<ICommitteeDocument>(
	"committeeModel",
	committeeSchema,
);
