import { studentModel } from "../../Models/Student";
import {
	AccountType,
	Department,
	IStudent,
	StudentPosition,
	Year,
} from "../../Types/ModelTypes";
import mongoose from "mongoose";
import { runTestServer, stopTestServer } from "../../Utils/util";

describe.only("Student Model Tests", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await studentModel.deleteOne({});
	});

	const validStudent: IStudent = {
		email: "student.123456789@vcet.edu.in",
		password: "secPd@123",
		year: Year["1ST"],
		department: Department.IT,
		studentId: 123456789,
		accType: AccountType.Student,
		position: [StudentPosition.Student],
		isProfileComplete: false,
	};

	const testCases = [
		// Valid cases
		{
			name: "valid single position student",
			student: {
				...validStudent,
				position: [StudentPosition.Student],
			},
			shouldThrow: false,
		},
		{
			name: "valid single position student incharge",
			student: {
				...validStudent,
				position: [StudentPosition.StudentIncharge],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid single position committee member",
			student: {
				...validStudent,
				position: [StudentPosition.CommitteeMember],
				isMemberOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		{
			name: "valid multiple positions (StudentIncharge and CommitteeMember)",
			student: {
				...validStudent,
				position: [
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
				isMemberOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: false,
		},
		// Invalid cases
		{
			name: "invalid single position student with committees",
			student: {
				...validStudent,
				position: [StudentPosition.Student],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position student with member of committees",
			student: {
				...validStudent,
				position: [StudentPosition.Student],
				isMemberOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position student incharge without in charge committees",
			student: {
				...validStudent,
				position: [StudentPosition.StudentIncharge],
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position student incharge with isMemberOfCommittees",
			student: {
				...validStudent,
				position: [StudentPosition.StudentIncharge],
				isMemberOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position committee member without member committees",
			student: {
				...validStudent,
				position: [StudentPosition.CommitteeMember],
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position committee member with member isInChargeOfCommittees",
			student: {
				...validStudent,
				position: [StudentPosition.CommitteeMember],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "invalid multiple positions (StudentIncharge and CommitteeMember) without isInChargeOfCommittees and isMemberOfCommittees",
			student: {
				...validStudent,
				position: [
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				],
			},
			shouldThrow: true,
		},
		{
			name: "invalid multiple positions (StudentIncharge and CommitteeMember) without isMemberOfCommittees",
			student: {
				...validStudent,
				position: [
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				],
				isInChargeOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
		{
			name: "invalid multiple positions (StudentIncharge and CommitteeMember) without isInChargeOfCommittees",
			student: {
				...validStudent,
				position: [
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				],
				isMemberOfCommittees: [new mongoose.Types.ObjectId()],
			},
			shouldThrow: true,
		},
	];

	it.each(testCases)("$name", async ({ student, shouldThrow }) => {
		const createStudent = async () => {
			const isStudentCreated = await studentModel.create(student);

			return isStudentCreated ? true : false;
		};

		if (shouldThrow) {
			await expect(createStudent()).rejects.toThrow();
		} else {
			await expect(createStudent()).resolves.toBeDefined();
		}
	});
});
