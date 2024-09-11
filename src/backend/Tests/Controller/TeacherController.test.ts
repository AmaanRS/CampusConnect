import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { teacherModel } from "../../Models/Teacher";
import { userModel } from "../../Models/User";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { Department } from "../../Types/ModelTypes";
import { createTestTeacher, createTestUser } from "../../Utils/testUtils";
import { TokenResponse } from "../../Types/GeneralTypes";

const createTeacherAndReturnToken = async () => {
	const isTeacherCreated = await createTestTeacher(Department.AIDS);

	if (!isTeacherCreated.success) {
		throw Error(isTeacherCreated.message);
	}

	return (isTeacherCreated as TokenResponse).token;
};

describe("Teacher Controller", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await userModel.deleteMany({});
		await teacherModel.deleteMany({});
	});

	describe.skip("POST /createTeacher", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createTeacherAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await teacherModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User not authenticated",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await userModel.deleteMany({});
				},
			},
			{
				name: "Department not provided for teacher",
				data: {
					department: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "HOD email with department provided",
				data: {
					department: "someDepartment",
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {
					const email = "hod_aids@vcet.edu.in";
					const password = "Afan@3242";

					const isUserCreated = await createTestUser(email, password);

					if (!isUserCreated.success) {
						throw Error(isUserCreated.message);
					}

					return (isUserCreated as TokenResponse).token;
				},
			},
			{
				name: "Successful teacher creation",
				data: {
					department: Department.AIDS,
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {
					await teacherModel.deleteMany({});
				},
			},
		];

		it.each(testCases)(
			"$name",
			async ({ data, expectedStatus, expectedResponse, setup }) => {
				if (setup) {
					let returnValue = await setup();
					returnValue ? (token = returnValue) : undefined;
				}

				const response = await request
					.post("/teacher/createTeacher")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body.success).toEqual(expectedResponse.success);
			},
		);
	});

	describe.skip("POST /getTeacher", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createTeacherAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await teacherModel.deleteMany({});
		});

		const testCases = [
			{
				name: "Teacher not found",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await teacherModel.deleteMany({});
				},
			},
			{
				name: "Successful Teacher retrieval",
				data: {},
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
					.post("/teacher/getTeacher")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;
				delete response.body.data;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});

	describe.skip("POST /updateTeacher", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createTeacherAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await teacherModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User not authenticated",
				data: { department: Department.IT },
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await teacherModel.deleteMany({});
				},
			},
			{
				name: "Department not provided",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Successful teacher update",
				data: { department: Department.AIDS },
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
					.post("/teacher/updateTeacher")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});

	describe.skip("POST /deleteTeacher", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createTeacherAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await teacherModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User not authenticated",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await teacherModel.deleteMany({});
				},
			},
			{
				name: "Successful teacher deletion",
				data: {},
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
					.post("/teacher/deleteTeacher")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});
});
