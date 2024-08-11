import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { userModel } from "../../Models/User";
import { adminModel } from "../../Models/Admin";
import { runTestServer, stopTestServer } from "../../Utils/util";

describe("Admin Controller", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await userModel.deleteMany({});
		await adminModel.deleteMany({});
	});

	describe("POST /createAdmin", () => {
		const testCases = [
			{
				name: "Missing decodedToken",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				shouldThrow: false,
			},
			{
				name: "User not found",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				shouldThrow: false,
				setup: async () => {
					await adminModel.deleteMany({});
				},
			},
			{
				name: "Successful admin creation",
				data: {},
				expectedStatus: 201,
				expectedResponse: { success: true },
				shouldThrow: false,
				setup: async () => {
					const email = "test.t@vcet.edu.in";
					const password = "Aa@123456";
					await userModel.create({
						email,
						password,
					});
					const response = await request
						.post("/login")
						.send({ email, password });
					return response.body.token;
				},
			},
		];

		it.each(testCases)(
			"$name",
			//@ts-ignore
			async ({ name, data, expectedStatus, expectedResponse, setup }) => {
				let token: string | null = null;
				let response;

				if (setup) {
					token = await setup();
				}

				if (token) {
					response = await request
						.post("/admin/createAdmin")
						.set("Authorization", `Bearer ${token}`)
						.send(data);
				} else {
					response = await request.post("/admin/createAdmin").send(data);
				}

				delete response.body.message;
				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});
	// describe("POST /getAdmin", () => {});
	// describe("POST /updateAdmin", () => {});
	// describe("POST /deleteAdmin", () => {});
});
