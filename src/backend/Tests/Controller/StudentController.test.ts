import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { userModel } from "../../Models/User";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { Department, Year } from "../../Types/ModelTypes";
import { studentModel } from "../../Models/Student";
import { TokenResponse } from "../../Types/GeneralTypes";
import { createTestStudent } from "../../Utils/testUtils";

const createStudentAndReturnToken = async () => {
	const isStudentCreated = await createTestStudent(Department.IT, Year["4TH"]);

	if (!isStudentCreated.success) {
		throw Error(isStudentCreated.message);
	}

	return (isStudentCreated as TokenResponse).token;
};

describe("Student Controller", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await userModel.deleteMany({});
		await studentModel.deleteMany({});
	});

	describe.skip("POST /createStudent", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createStudentAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await studentModel.deleteMany({});
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
				name: "Department not provided for Student",
				data: {
					department: undefined,
					year: Year["1ST"],
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Year not provided for Student",
				data: {
					department: Department.AIDS,
					year: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Year and Department not provided for Student",
				data: {
					department: undefined,
					year: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Successful student creation",
				data: {
					department: Department.AIDS,
					year: Year["1ST"],
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {
					await studentModel.deleteMany({});
				},
			},
		];

		it.each(testCases)(
			"$name",
			async ({ data, expectedStatus, expectedResponse, setup }) => {
				if (setup) await setup();

				const response = await request
					.post("/student/createStudent")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body.success).toEqual(expectedResponse.success);
			},
		);
	});

	describe.skip("POST /getStudent", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createStudentAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await studentModel.deleteMany({});
		});

		const testCases = [
			{
				name: "Student not found",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await studentModel.deleteMany({});
				},
			},
			{
				name: "Successful student retrieval",
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
					.post("/student/getStudent")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;
				delete response.body.data;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});

	describe.skip("POST /updateStudent", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createStudentAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await studentModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User not authenticated",
				data: { department: Department.IT, year: Year["1ST"] },
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await studentModel.deleteMany({});
				},
			},
			{
				name: "Department and year not provided",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "Successful Student update with department",
				data: { department: Department.AIDS },
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {},
			},
			{
				name: "Successful Student update with year",
				data: { year: Year["3RD"] },
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
					.post("/student/updateStudent")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});

	describe.skip("POST /deleteStudent", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createStudentAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await studentModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User not authenticated",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await studentModel.deleteMany({});
				},
			},
			{
				name: "Successful student deletion",
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
					.post("/student/deleteStudent")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});
});
