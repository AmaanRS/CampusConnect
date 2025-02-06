import { Model, MongooseError, Schema, model } from "mongoose";
import {
	Department,
	AccountType,
	ITeacherDocument,
	TeacherPosition,
} from "../Types/ModelTypes";
import { teacherEmailRegex } from "../Utils/regexUtils";
import { validateAndHash } from "../Utils/passwordUtils";

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
						enum: Object.values(TeacherPosition),
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
	},
	{
		timestamps: true,
	},
);

teacherSchema.pre("validate", async function (next) {
	try {
		const hashedPassword = await validateAndHash(this.password);
		this.password = hashedPassword;

		// By default
		this.isProfileComplete = false;

		this.accType = AccountType.Teacher;

		next();
	} catch (err) {
		next(err as MongooseError);
	}
});

// Hooks for which inactive teacher will not be returned
const hooks = [
	"find",
	"findOne",
	"findOneAndUpdate",
	"deleteOne",
	"deleteMany",
	"updateOne",
	"updateMany",
] as const;

// Programatically adds condition to remove inactive teachers from the query result
// When inactive teachers are also needed and should not be excluded set _skipInactiveTeachersInHook
// If in some place this code gives error then set _skipInactiveTeachersInHook as true
hooks.forEach(function (hook) {
	teacherSchema.pre(hook, function (next) {
		const options = this.getOptions();
		const query = this.getQuery();

		// _skipInactiveTeachersInHook; flag when true, will allow hooks to show inactive teachers
		if (options && !options["_skipInactiveTeachersInHook"]) {
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

teacherSchema.pre("save", async function (next) {
	try {
		// If all fields are given except the optional fields then set isProfileComplete to true
		if (this.email && this.password && this.department && this.accType) {
			this.isProfileComplete = true;
		}
	} catch (err) {
		next(err as MongooseError);
	}
});

export const teacherModel: Model<ITeacherDocument> = model<ITeacherDocument>(
	"teacherModel",
	teacherSchema,
);
