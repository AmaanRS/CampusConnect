import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { teacherModel } from "../../Models/Teacher";
import { userModel } from "../../Models/User";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { Department } from "../../Types/ModelTypes";

const createTeacherAndReturnToken = async () => {
	const email = "test.t@vcet.edu.in";
	const password = "Aa@123456";

	await userModel.create({ email, password });

	const response = await request.post("/login").send({ email, password });

	// Create a default admin for testing purposes
	await request
		.post("/teacher/createTeacher")
		.set("Authorization", `Bearer ${response.body.token}`)
		.send({ department: Department.IT });

	return response.body.token;
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
					const email = "hod_it@vcet.edu.in";
					const password = "Pword123@";

					await userModel.create({
						email,
						password,
					});

					const response = await request.post("/login").send({
						email,
						password,
					});

					return response.body.token;
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
			//@ts-ignore
			async ({ name, data, expectedStatus, expectedResponse, setup }) => {
				if (setup) {
					let returnValue = await setup();
					returnValue ? (token = returnValue) : undefined;
				}

				// const res = await request
				// 	.post("/teacher/getTeacher")
				// 	.set("Authorization", `Bearer ${token}`)
				// 	.send();
				// console.log(res);

				const response = await request
					.post("/teacher/createTeacher")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
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
					// Delete the admin so it doesnt exist
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
			//@ts-ignore
			async ({ name, data, expectedStatus, expectedResponse, setup }) => {
				if (setup) await setup();

				const response = await request
					.post("/teacher/getTeacher")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				console.log(response.body.message);

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
			//@ts-ignore
			async ({ name, data, expectedStatus, expectedResponse, setup }) => {
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
			//@ts-ignore
			async ({ name, data, expectedStatus, expectedResponse, setup }) => {
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
