import dotenv from "dotenv";
import { startServer } from "../../app";
import { studentModel } from "../../Models/Student";
import {
	AccountType,
	Department,
	IStudent,
	StudentPosition,
	Year,
} from "../../Types/ModelTypes";
import mongoose from "mongoose";
dotenv.config();

jest.mock("mongoose");

describe.only("Student Model Tests", () => {
	beforeAll(async () => {
		const mockConnection = jest.fn().mockResolvedValueOnce({
			connection: {
				db: {
					databaseName: "CampusConnectSelf",
				},
			},
		});

		(mongoose.connect as jest.Mock) = mockConnection;
		await startServer(
			process.env.MONGO_URI!,
			process.env.PORT!,
			process.env.REPL_SET!,
		);
	});

	//use done or return for async code
	// afterAll((done) => {
	// 	mongoose.disconnect();
	// 	jest.clearAllMocks();
	// 	done();
	// });

	afterEach(async () => {
		await studentModel.deleteMany({});
	});

	const validStudent: IStudent = {
		email: "student@example.com",
		password: "securePassword123",
		year: Year["1ST"],
		department: Department.IT,
		studentId: 123456789,
		accType: AccountType.Student,
		position: [...new Set([StudentPosition.Student])],
		isProfileComplete: false,
	};

	const testCases = [
		// Valid cases
		{
			name: "valid single position student",
			student: {
				...validStudent,
				position: new Set([StudentPosition.Student]),
			},
			shouldThrow: false,
		},
		{
			name: "valid single position student incharge",
			student: {
				...validStudent,
				position: new Set([StudentPosition.StudentIncharge]),
				isInChargeOfCommittees: new Set(),
			},
			shouldThrow: false,
		},
		{
			name: "valid single position committee member",
			student: {
				...validStudent,
				position: new Set([StudentPosition.CommitteeMember]),
				isMemberOfCommittees: new Set(),
			},
			shouldThrow: false,
		},
		{
			name: "valid multiple positions (StudentIncharge and CommitteeMember)",
			student: {
				...validStudent,
				position: new Set([
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				]),
				isInChargeOfCommittees: new Set(),
				isMemberOfCommittees: new Set(),
			},
			shouldThrow: false,
		},
		// Invalid cases
		{
			name: "invalid single position student with committees",
			student: {
				...validStudent,
				position: new Set([StudentPosition.Student]),
				isInChargeOfCommittees: new Set(),
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position student with member of committees",
			student: {
				...validStudent,
				position: new Set([StudentPosition.Student]),
				isMemberOfCommittees: new Set(),
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position student incharge without in charge committees",
			student: {
				...validStudent,
				position: new Set([StudentPosition.StudentIncharge]),
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position student incharge with isMemberOfCommittees",
			student: {
				...validStudent,
				position: new Set([StudentPosition.StudentIncharge]),
				isMemberOfCommittees: new Set(),
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position committee member without member committees",
			student: {
				...validStudent,
				position: new Set([StudentPosition.CommitteeMember]),
			},
			shouldThrow: true,
		},
		{
			name: "invalid single position committee member with member isInChargeOfCommittees",
			student: {
				...validStudent,
				position: new Set([StudentPosition.CommitteeMember]),
				isInChargeOfCommittees: new Set(),
			},
			shouldThrow: true,
		},
		{
			name: "invalid multiple positions (StudentIncharge and CommitteeMember) without isInChargeOfCommittees and isMemberOfCommittees",
			student: {
				...validStudent,
				position: new Set([
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				]),
			},
			shouldThrow: true,
		},
		{
			name: "invalid multiple positions (StudentIncharge and CommitteeMember) without isMemberOfCommittees",
			student: {
				...validStudent,
				position: new Set([
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				]),
				isInChargeOfCommittees: new Set(),
			},
			shouldThrow: true,
		},
		{
			name: "invalid multiple positions (StudentIncharge and CommitteeMember) without isInChargeOfCommittees",
			student: {
				...validStudent,
				position: new Set([
					StudentPosition.StudentIncharge,
					StudentPosition.CommitteeMember,
				]),
				isMemberOfCommittees: new Set(),
			},
			shouldThrow: true,
		},
	];

	it.each(testCases)(
		"should $shouldThrow ? 'fail' : 'pass' when $name",
		async ({ student, shouldThrow }) => {
			const createStudent = async () => {
				await studentModel.create(student);
			};

			if (shouldThrow) {
				await expect(await createStudent()).rejects.toThrow();
			} else {
				await expect(await createStudent()).resolves.toBeDefined();
			}
		},
	);
});
