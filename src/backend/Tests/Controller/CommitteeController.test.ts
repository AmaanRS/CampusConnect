import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { committeeModel } from "../../Models/Committee";
import { studentModel } from "../../Models/Student";
import { teacherModel } from "../../Models/Teacher";
import { CommitteeStatus, Department, Year } from "../../Types/ModelTypes";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { userModel } from "../../Models/User";

const emailTeach = "hod.it@vcet.edu.in";
const emailStu = "test.123456789@vcet.edu.in";
const password = "Aa@123456";
const createTeacherAndStudentAndReturnToken = async () => {
	await userModel.create({ email: emailTeach, password });
	await userModel.create({ email: emailStu, password });

	const response1 = await request
		.post("/user/login")
		.send({ email: emailTeach, password });
	const response2 = await request
		.post("/user/login")
		.send({ email: emailStu, password });

	await request
		.post("/teacher/createTeacher")
		.set("Authorization", `Bearer ${response1.body.token}`)
		.send({ department: Department.IT });

	await request
		.post("/student/createStudent")
		.set("Authorization", `Bearer ${response2.body.token}`)
		.send({ department: Department.IT, year: Year["1ST"] });

	return response1.body.token;
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
			//@ts-ignore
			async ({ name, data, expectedStatus, expectedResponse, setup }) => {
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
