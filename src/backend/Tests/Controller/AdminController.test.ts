import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { userModel } from "../../Models/User";
import { adminModel } from "../../Models/Admin";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { AdminPosition } from "../../Types/ModelTypes";

const createAdminAndReturnToken = async () => {
	const email = "test.t@vcet.edu.in";
	const password = "Aa@123456";

	await userModel.create({ email, password });

	const response = await request.post("/login").send({ email, password });

	// Create a default admin for testing purposes
	await request
		.post("/admin/createAdmin")
		.set("Authorization", `Bearer ${response.body.token}`)
		.send();

	return response.body.token;
};

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

	describe.skip("POST /createAdmin", () => {
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

	describe.skip("POST /getAdmin", () => {
		let token: string | undefined;

		beforeEach(async () => {
			token = await createAdminAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await adminModel.deleteMany({});
		});

		const testCases = [
			{
				name: "Admin not found",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					// Delete the admin so it doesnt exist
					await adminModel.deleteMany({});
				},
			},
			{
				name: "Successful admin retrieval",
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
					.post("/admin/getAdmin")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;
				delete response.body.data;

				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});

	describe.skip("POST /updateAdmin", () => {
		let token: string;

		beforeEach(async () => {
			token = await createAdminAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await adminModel.deleteMany({});
		});

		const testCases = [
			{
				name: "Empty positions array",
				data: {
					position: [],
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
			},
			{
				name: "Admin not found",
				data: {
					position: [AdminPosition.Admin],
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await adminModel.deleteMany({});
				},
			},
			{
				name: "Successful admin update",
				data: {
					position: [AdminPosition.Admin],
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
					.post("/admin/updateAdmin")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;
				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});

	describe.skip("POST /deleteAdmin", () => {
		let token: string;

		beforeEach(async () => {
			token = await createAdminAndReturnToken();
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await adminModel.deleteMany({});
			jest.restoreAllMocks();
		});

		const testCases = [
			{
				name: "Admin not found (Admin does not exist)",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					await adminModel.deleteMany({});
					console.log(await adminModel.find({}));
				},
			},
			{
				name: "Unsuccessful deletion (Admin exists but deletion fails)",
				data: { decodedToken: { email: "test.t@vcet.edu.in" } },
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					// Mocking an unsuccessful deletion scenario
					jest.spyOn(adminModel, "deleteOne").mockResolvedValueOnce({
						deletedCount: 0,
						acknowledged: false,
					});
				},
			},
			{
				name: "Successful deletion",
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
					.post("/admin/deleteAdmin")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;
				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});
});
