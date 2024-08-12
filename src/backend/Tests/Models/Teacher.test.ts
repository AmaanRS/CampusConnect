import dotenv from "dotenv";
import { startServer } from "../../app";
import { AccountType, Department, TeacherPosition } from "../../Types/ModelTypes";
import mongoose, { MongooseError } from "mongoose";
import { teacherModel } from "../../Models/Teacher";
dotenv.config();

describe.only("Teacher Model Tests", () => {
	beforeAll(async () => {
		await startServer(
			process.env.MONGO_URI!,
			process.env.PORT!,
			process.env.REPL_SET!,
		);
	});

	afterEach(async () => {
		await teacherModel.deleteOne({});
	});

	const validTeacherData = {
		email: "john.doe@vcet.edu.in",
		password: "Passw@123",
		department: Department.IT,
		accType: AccountType.Teacher,
		position: [TeacherPosition.Teacher],
	};

	const testCases = [
		// Valid cases
		{
			name: "valid data with Teacher",
			data: { ...validTeacherData, position: [TeacherPosition.Teacher] },
			shouldThrow: false,
		},
		{
			name: "valid data with HOD",
			data: { ...validTeacherData, position: [TeacherPosition.HOD] },
			shouldThrow: false,
		},
		{
			name: "valid data with Teacher and HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.Teacher, TeacherPosition.HOD],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyIncharge and Teacher",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.Teacher],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyIncharge and HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.HOD],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyIncharge, Teacher, and HOD",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.Teacher,
					TeacherPosition.HOD,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyTeam and Teacher",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.Teacher],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyTeam and HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.HOD],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyTeam, Teacher, and HOD",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyTeam,
					TeacherPosition.Teacher,
					TeacherPosition.HOD,
				],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid data with FacultyIncharge and FacultyTeam, both committees provided",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "valid data with FacultyIncharge, FacultyTeam, Teacher, and HOD, both committees provided",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
					TeacherPosition.Teacher,
					TeacherPosition.HOD,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},

		// Invalid cases
		{
			name: "missing email",
			data: { ...validTeacherData, email: undefined },
			shouldThrow: true,
		},
		{
			name: "missing password",
			data: { ...validTeacherData, password: undefined },
			shouldThrow: true,
		},
		{
			name: "missing department",
			data: { ...validTeacherData, department: undefined },
			shouldThrow: true,
		},
		{
			name: "missing accType",
			data: { ...validTeacherData, accType: undefined },
			shouldThrow: true,
		},
		{
			name: "missing position",
			data: { ...validTeacherData, position: undefined },
			shouldThrow: true,
		},
		{
			name: "invalid email format",
			data: { ...validTeacherData, email: "invalid-email" },
			shouldThrow: true,
		},
		{
			name: "empty position array",
			data: { ...validTeacherData, position: [] },
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge without isInChargeOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge],
				isInChargeOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam without isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam without both committees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam with only isInChargeOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam with only isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam with different committees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam with missing one committee",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam with missing one committee",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with missing Teacher or HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam with missing Teacher or HOD",
			data: { ...validTeacherData, position: [TeacherPosition.FacultyTeam] },
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and HOD without Teacher",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.HOD],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam and HOD without Teacher",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.HOD],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and Teacher without HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam and Teacher without HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge, Teacher, and FacultyTeam",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.Teacher,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "FacultyIncharge and FacultyTeam with missing HOD",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge, Teacher, HOD with missing FacultyTeam",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.Teacher,
					TeacherPosition.HOD,
				],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge, Teacher, FacultyTeam with missing HOD",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.Teacher,
					TeacherPosition.FacultyTeam,
				],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam, Teacher with missing FacultyIncharge",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.Teacher],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "FacultyTeam, HOD with missing FacultyIncharge",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.HOD],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "FacultyIncharge without isInChargeOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge],
				isInChargeOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam without isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with empty isInChargeOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge],
				isInChargeOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam with empty isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with empty isInChargeOfCommittees and FacultyTeam with empty isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with isInChargeOfCommittees and FacultyTeam without isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with isInChargeOfCommittees and FacultyTeam with different committee",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with missing Teacher or HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam with missing Teacher or HOD",
			data: { ...validTeacherData, position: [TeacherPosition.FacultyTeam] },
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and Teacher without HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam and Teacher without HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge, Teacher, and FacultyTeam without HOD",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.Teacher,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "FacultyIncharge, Teacher, and HOD with missing FacultyTeam",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.Teacher,
					TeacherPosition.HOD,
				],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam with missing isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge, Teacher with missing HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam, HOD without FacultyIncharge",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.HOD],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "FacultyIncharge with valid isInChargeOfCommittees and FacultyTeam with missing isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with missing isInChargeOfCommittees and FacultyTeam with valid isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge without Teacher or HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam without Teacher or HOD",
			data: { ...validTeacherData, position: [TeacherPosition.FacultyTeam] },
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and HOD with missing Teacher",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.HOD],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam and HOD with missing Teacher",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.HOD],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and Teacher with missing HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam and Teacher with missing HOD",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam, TeacherPosition.Teacher],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and Teacher with FacultyTeam and missing HOD",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
					TeacherPosition.Teacher,
				],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and HOD with missing FacultyTeam",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyIncharge, TeacherPosition.HOD],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyTeam with missing HOD and isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [TeacherPosition.FacultyTeam],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with missing isInChargeOfCommittees and FacultyTeam with valid isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge with valid isInChargeOfCommittees and FacultyTeam with empty isInTeamOfCommittees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam without any committees",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
			},
			shouldThrow: true,
		},
		{
			name: "FacultyIncharge and FacultyTeam with mismatched committee lists",
			data: {
				...validTeacherData,
				position: [
					TeacherPosition.FacultyIncharge,
					TeacherPosition.FacultyTeam,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isInTeamOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
	];

	it.each(testCases)("should $name", async ({ data, shouldThrow }) => {
		const teacher = new teacherModel(data);
		if (shouldThrow) {
			await expect(teacher.save()).rejects.toThrow(MongooseError);
		} else {
			await expect(teacher.save()).resolves.toBeDefined();
		}
	});
});
