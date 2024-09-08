import { runTestServer, stopTestServer } from "../../Utils/util";
import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { Request } from "express";
import { cookieCheckerFunction, verifyToken } from "../../Middlewares/CookieChecker";
import { userModel } from "../../Models/User";

describe("CookieChecker Tests", () => {
	// Utility function to create a mock request with a specific token
	const createRequest = (token: string | undefined) => {
		return token === undefined
			? ({ headers: {} } as Request)
			: ({
					headers: {
						authorization: `Bearer ${token}`,
					},
				} as Request);
	};

	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	describe.skip("verifyToken function", () => {
		let token: string;
		const email = "a.a@vcet.edu.in";
		const password = "Aaa123@2";

		beforeAll(async () => {
			await userModel.create({ email, password });

			const response = await request
				.post("/user/login")
				.send({ email, password });

			token = response.body.token;
		});

		afterAll(async () => {
			await userModel.deleteOne({ email });
		});

		const testCases = [
			// {
			// 	name: "No token provided",
			// 	expectedStatus: 401,
			// 	expectedResponse: {
			// 		success: false,
			// 	},
			// 	setup: () => createRequest(undefined),
			// },
			// {
			// 	name: "Invalid token provided",
			// 	expectedStatus: 401,
			// 	expectedResponse: {
			// 		success: false,
			// 	},
			// 	setup: () => createRequest(token + "a"),
			// },
			{
				name: "Valid token provided",
				expectedStatus: 200,
				expectedResponse: {
					success: true,
					decodedToken: {
						email: "user@example.com",
						position: ["admin"],
						accountType: "Admin",
					},
				},
				setup: () => createRequest(token),
			},
		];

		it.each(testCases)("$name", async ({ expectedResponse, setup }) => {
			const req = setup();

			const response = verifyToken(req);

			expect(response.success).toBe(expectedResponse.success);

			if (expectedResponse.success) {
				// @ts-ignore
				expect(response.decodedToken).toMatchObject({
					email: expect.any(String),
					position: expect.any(Array),
					accountType: expect.any(String),
					isProfileComplete: expect.any(Boolean),
					isAccountActive: expect.any(Boolean),
				});

				//@ts-ignore
				// That is, it only has six properties
				expect(Object.keys(response.decodedToken).length).toEqual(6);
			}
		});
	});

	describe.skip("cookieCheckerFunction function", () => {
		let token: string;
		const email = "a.a@vcet.edu.in";
		const password = "Aaa123@2";

		beforeAll(async () => {
			await userModel.create({ email, password });

			const response = await request
				.post("/user/login")
				.send({ email, password });

			token = response.body.token;
		});

		afterAll(async () => {
			await userModel.deleteOne({ email });
		});

		const testCases = [
			{
				name: "Token verification fails",
				expectedStatus: 401,
				expectedResponse: {
					success: false,
				},
				setup: async () => {
					return token + "a";
				},
			},
			{
				name: "Token verification succeeds",
				expectedStatus: 200,
				expectedResponse: {
					success: true,
					decodedToken: { email: "user@example.com", role: "admin" },
				},
				setup: async () => {},
			},
		];

		it.each(testCases)("$name", async ({ expectedResponse, setup }) => {
			let res;
			if (setup) {
				res = await setup();
			}

			// Create a mock request
			const request = createRequest(res || token);

			// Call the function to be tested
			const response = cookieCheckerFunction(request);

			expect(response.success).toEqual(expectedResponse.success);

			if (expectedResponse.decodedToken) {
				expect(response).toHaveProperty("decodedToken");

				// @ts-ignore
				expect(response.decodedToken).toBeDefined();

				// @ts-ignore
				expect(response.decodedToken).toMatchObject({
					email: expect.any(String),
					position: expect.any(Array),
					accountType: expect.any(String),
					isProfileComplete: expect.any(Boolean),
					isAccountActive: expect.any(Boolean),
				});

				//@ts-ignore
				// That is, it only has six properties
				expect(Object.keys(response.decodedToken).length).toEqual(6);
			}
		});
	});

	describe.skip("cookieCheckerMiddleware middleware", () => {
		let token: string;
		const email = "a.a@vcet.edu.in";
		const password = "Aaa123@2";

		beforeAll(async () => {
			await userModel.create({ email, password });

			const response = await request
				.post("/user/login")
				.send({ email, password });

			token = response.body.token;
		});

		afterAll(async () => {
			await userModel.deleteOne({ email });
		});

		const testCases = [
			{
				name: "Token is missing",
				setup: () => request.post("/user/login").send({}),
				expectedStatus: 401,
				expectedResponse: {
					message: "User not authenticated",
					success: false,
				},
			},
			{
				name: "Token is invalid",
				setup: () =>
					request
						.post("/user/login")
						.set("Authorization", "Bearer invalidtoken")
						.send({}),
				expectedStatus: 401,
				expectedResponse: {
					message: "User not authenticated",
					success: false,
				},
			},
			{
				name: "Token is valid and has decodedToken",
				setup: () => {
					return request
						.post("/user/login")
						.set("Authorization", `Bearer ${token}`)
						.send({ email, password });
				},
				expectedStatus: 201,
				expectedResponse: {
					decodedToken: {
						email: "user@example.com",
						position: ["admin"],
						accountType: "admin",
						isProfileCompleted: true,
						isAccountActive: true,
					},
				},
			},
		];

		it.each(testCases)(
			"$name",
			async ({ setup, expectedStatus, expectedResponse }) => {
				const response = await setup();

				expect(response.status).toBe(expectedStatus);

				if (expectedResponse.decodedToken) {
					expect(response.body).toHaveProperty("token");
				}
			},
		);
	});
});
