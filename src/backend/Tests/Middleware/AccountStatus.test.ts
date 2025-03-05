import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { userModel } from "../../Models/User";
import { runTestServer, stopTestServer } from "../../Utils/util";

describe("isAccountActive middleware", () => {
	let token: string;
	const email = "a.a@vcet.edu.in";
	const password = "Aaa123@2";

	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	beforeEach(async () => {
		await userModel.deleteMany({});

		await userModel.create({ email, password });

		const response = await request.post("/user/login").send({ email, password });

		token = response.body.token;
	});

	afterEach(async () => {
		await userModel.deleteMany({});
	});

	const testCases = [
		{
			name: "Skips the middleware for paths",
			path: "/user/signup",
			expectedStatus: 201,
			expectedResponse: {
				success: true,
			},
			setup: async () => {
				await userModel.deleteMany({});
			},
		},
		{
			name: "User's account is not active",
			path: "/getAllPendingCommittees",
			expectedStatus: 401,
			expectedResponse: {
				success: false,
			},
			setup: async () => {
				const email = "a.inactive@vcet.edu.in";
				const password = "Test@1234";

				// Insert a user with isAccountActive: false
				await userModel.create({
					email,
					isAccountActive: false,
					password,
				});

				const response = await request
					.post("/user/login")
					.send({ email, password });

				token = response.body.token;
			},
		},
		{
			name: "User's account is active",
			path: "/user/login",
			expectedStatus: 201,
			expectedResponse: {
				success: true,
			},
			setup: async () => {},
		},
		{
			name: "User not found in database",
			path: "/getAllPendingCommittees",
			expectedStatus: 401,
			expectedResponse: {
				success: false,
			},
			setup: async () => {
				await userModel.deleteMany({});
			},
		},
	];

	it.each(testCases)(
		"$name",
		async ({ path, expectedStatus, expectedResponse, setup }) => {
			await setup();

			const response = await request
				.post(path)
				.set("Authorization", `Bearer ${token}`)
				.send({ email, password });

			expect(response.status).toBe(expectedStatus);
			expect(response.body.success).toEqual(expectedResponse.success);
		},
	);
});
