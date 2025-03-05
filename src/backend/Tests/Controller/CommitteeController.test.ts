import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { committeeModel } from "../../Models/Committee";
import { studentModel } from "../../Models/Student";
import { teacherModel } from "../../Models/Teacher";
import { CommitteeStatus, Department, Year } from "../../Types/ModelTypes";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { userModel } from "../../Models/User";
import { createTestStudent, createTestTeacher } from "../../Utils/testUtils";
import { TokenResponse } from "../../Types/GeneralTypes";

const emailTeach = "hod_it@vcet.edu.in";
const emailStu = "test.123456789@vcet.edu.in";

const createTeacherAndStudentAndReturnToken = async () => {
	const isTeacherCreated = await createTestTeacher(Department.AIDS, emailTeach);

	if (!isTeacherCreated.success) {
		throw Error(isTeacherCreated.message);
	}

	const isStudentCreated = await createTestStudent(
		Department.IT,
		Year["4TH"],
		emailStu,
	);

	if (!isStudentCreated.success) {
		throw Error(isStudentCreated.message);
	}

	return (isTeacherCreated as TokenResponse).token;
};

describe("Student Controller", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await committeeModel.deleteMany({});
		await studentModel.deleteMany({});
		await teacherModel.deleteMany({});
		await userModel.deleteMany({});
	});

	describe("POST /createCommittee", () => {
		let token: string;

		beforeEach(async () => {
			token = await createTeacherAndStudentAndReturnToken();
		});

		afterEach(async () => {
			await committeeModel.deleteMany({});
			await studentModel.deleteMany({});
			await teacherModel.deleteMany({});
			await userModel.deleteMany({});
		});

		const validCommittee = {
			committeeId: "euqhe",
			name: "Tech Club",
			description: "A club for tech enthusiasts",
			studentIncharge: emailStu,
			facultyIncharge: emailTeach,
			committeeOfDepartment: [Department.IT],
			status: CommitteeStatus.PENDING,
		};

		const testCases = [
			{
				name: "Missing name in request body",
				data: {
					...validCommittee,
					name: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Missing description in request body",
				data: {
					...validCommittee,
					description: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Missing studentIncharge in request body",
				data: {
					...validCommittee,
					studentIncharge: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Missing committeeOfDepartment in request body",
				data: {
					...validCommittee,
					committeeOfDepartment: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Empty committeeOfDepartment array",
				data: {
					...validCommittee,
					committeeOfDepartment: [],
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "StudentIncharge not found in database",
				data: {
					...validCommittee,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await studentModel.deleteMany({});
				},
			},
			{
				name: "FacultyIncharge not found in database",
				data: {
					...validCommittee,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await teacherModel.deleteMany({});
				},
			},
			{
				name: "Successful committee creation",
				data: {
					...validCommittee,
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {},
			},
		];

		it.each(testCases)(
			"$name",
			async ({ data, expectedStatus, expectedResponse, setup }) => {
				if (setup) await setup();

				const response = await request
					.post("/committee/createCommittee")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});
});
