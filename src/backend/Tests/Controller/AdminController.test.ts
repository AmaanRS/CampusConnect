import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { userModel } from "../../Models/User";
import { adminModel } from "../../Models/Admin";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { AdminPosition } from "../../Types/ModelTypes";
import {
	createTestAdmin,
	createTestUser,
	getRandomStudentEmail,
} from "../../Utils/testUtils";
import { TokenResponse } from "../../Types/GeneralTypes";

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
				setup: async () => {},
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
					const isAdminCreated = await createTestUser(
						getRandomStudentEmail(),
						"Aa1234@12",
					);

					if (!isAdminCreated.success) {
						throw Error(isAdminCreated.message);
					}

					return (isAdminCreated as TokenResponse).token;
				},
			},
		];

		it.each(testCases)(
			"$name",
			async ({ data, expectedStatus, expectedResponse, setup }) => {
				let token: string | null | void = null;
				let response;

				if (setup) token = await setup();

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
				expect(response.body.success).toEqual(expectedResponse.success);
			},
		);
	});

	describe.skip("POST /getAdmin", () => {
		let token: string | undefined;

		beforeEach(async () => {
			const adminEmail = "hod_it@vcet.edu.in";
			const isAdminCreated = await createTestAdmin(adminEmail);

			if (!isAdminCreated.success) {
				throw Error(isAdminCreated.message);
			}

			token = (isAdminCreated as TokenResponse).token;
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
			async ({ data, expectedStatus, expectedResponse, setup }) => {
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
			const adminEmail = "hod_it@vcet.edu.in";
			const isAdminCreated = await createTestAdmin(adminEmail);

			if (!isAdminCreated.success) {
				throw Error(isAdminCreated.message);
			}

			token = (isAdminCreated as TokenResponse).token;
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
			async ({ data, expectedStatus, expectedResponse, setup }) => {
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
			const adminEmail = "hod_it@vcet.edu.in";
			const isAdminCreated = await createTestAdmin(adminEmail);

			if (!isAdminCreated.success) {
				throw Error(isAdminCreated.message);
			}

			token = (isAdminCreated as TokenResponse).token;
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
				},
			},
			{
				name: "Unsuccessful deletion (Admin exists but deletion fails)",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
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

	describe.skip("POST /deleteUserByEmail", () => {
		let token: string | undefined;
		let userEmail: string = "a.b@vcet.edu.in";
		let userPassword: string = "Ab@123456";

		beforeEach(async () => {
			const adminEmail = "hod_it@vcet.edu.in";
			const isAdminCreated = await createTestAdmin(adminEmail);

			if (!isAdminCreated.success) {
				throw Error(isAdminCreated.message);
			}

			token = (isAdminCreated as TokenResponse).token;
		});

		afterEach(async () => {
			await userModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User email not given",
				data: {
					userEmail: undefined,
					toggle: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
			},
			{
				name: "Toggle not given",
				data: {
					userEmail: userEmail,
					toggle: undefined,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
			},
			{
				name: "Invalid user email",
				data: {
					userEmail: "invalid-email",
					toggle: true,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
			},
			{
				name: "Successful activation of user account",
				data: {
					userEmail: userEmail,
					toggle: true,
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {
					const isUserCreated = await createTestUser(
						userEmail,
						userPassword,
					);

					if (!isUserCreated.success) {
						throw Error(isUserCreated.message);
					}
				},
			},
			{
				name: "Successful deactivation of user account",
				data: {
					userEmail: userEmail,
					toggle: false,
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async () => {
					const isUserCreated = await createTestUser(
						userEmail,
						userPassword,
					);

					if (!isUserCreated.success) {
						throw Error(isUserCreated.message);
					}
				},
			},
			{
				name: "User not found",
				data: {
					userEmail: "a.bc@vcet.edu.in",
					toggle: true,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
			},
		];

		it.each(testCases)(
			"$name",
			async ({ data, expectedStatus, expectedResponse, setup }) => {
				if (setup) await setup();

				const response = await request
					.post("/admin/deleteUserByEmail")
					.set("Authorization", `Bearer ${token}`)
					.send(data);

				delete response.body.message;
				expect(response.status).toBe(expectedStatus);
				expect(response.body).toEqual(expectedResponse);
			},
		);
	});
});
