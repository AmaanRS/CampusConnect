import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { faker } from "@faker-js/faker";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { userModel } from "../../Models/User";
import { createTestUser } from "../../Utils/testUtils";
import { TokenResponse } from "../../Types/GeneralTypes";

let token: any = "";

const createDummyUser = async (email: string, password: string) => {
	const isUserCreated = await createTestUser(email, password);

	if (!isUserCreated.success) {
		throw Error(isUserCreated.message);
	}

	return (isUserCreated as TokenResponse).token;
};

const deleteDummyUser = async () => {
	const res = await userModel.deleteMany({});
	if (!res) {
		throw new Error("Dummy user not deleted due to some reason");
	}
};

describe("User Controller", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	describe.skip("POST /user/signup", () => {
		afterEach(async () => {
			await userModel.deleteMany({});
		});

		it("should save user to database on valid email and password", async () => {
			const testEmail = "a.a@vcet.edu.in";
			const testPassword = "Aa@123456";

			const res = await request
				.post("/user/signup")
				.send({ email: testEmail, password: testPassword });

			console.log(res.body);

			expect(res.body.success).toEqual(true);
			expect(res.status).toEqual(201);
		});

		it("should not save user when password is not given", async () => {
			const testEmail = "a.a@vcet.edu.in";

			const res = await request
				.post("/user/signup")
				.send({ email: testEmail });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should not save user when email is not given", async () => {
			const testPassword = "Aa@123456";

			const res = await request
				.post("/user/signup")
				.send({ password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should not save user when password does not follow the validations", async () => {
			const testEmail = "a.a@vcet.edu.in";

			let testPasswords = [
				// Length less than 8 check
				faker.string.alphanumeric({ length: 3 }),

				//Length greater than 10 check
				faker.string.alphanumeric({ length: 12 }),

				//No lowercase but everything else present check
				faker.string.alpha({ length: 7, casing: "upper" }) +
					faker.string.numeric(1) +
					faker.string.symbol(1),

				//No uppercase but everything else present check
				faker.string.alpha({ length: 7, casing: "lower" }) +
					faker.string.numeric(1) +
					faker.string.symbol(1),

				//No number but everything else present check
				faker.string.alpha({ length: 6 }) +
					faker.string.alpha({ length: 1, casing: "upper" }) +
					faker.string.alpha({ length: 1, casing: "lower" }) +
					faker.string.symbol(1),

				//No special character but everything else present check
				faker.string.alpha({ length: 8 }) +
					faker.string.alpha({ length: 1, casing: "upper" }) +
					faker.string.alpha({ length: 1, casing: "lower" }) +
					+faker.string.numeric(1),
			];

			for (let i = 0; i < testPasswords.length; i++) {
				const res = await request
					.post("/user/signup")
					.send({ email: testEmail, password: testPasswords[i] });

				expect(res.body.success).toEqual(false);
				expect(res.status).toEqual(401);
			}
		});

		it("should not save user when email is invalid", async () => {
			const testEmail = "ajioj.wq";
			const testPassword = "Aa@123456";

			const res = await request
				.post("/user/signup")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should not save user when email is duplicate", async () => {
			//While testing this case remember that testEmail should be a email which already exists in db
			const testEmail = "a@b.com";
			const testPassword = "Aa@123456";

			await request
				.post("/user/signup")
				.send({ email: testEmail, password: testPassword });

			const res = await request
				.post("/user/signup")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});
	});

	describe.skip("POST /user/login", () => {
		const testEmail = "a.123456789@vcet.edu.in";
		const testPassword = "Aa1@bcdqwe";

		beforeEach(async () => await createDummyUser(testEmail, testPassword));

		afterEach(async () => await deleteDummyUser());

		it("should not save user when password is not given", async () => {
			const testEmail = "a.a@vcet.edu.in";

			const res = await request.post("/user/login").send({ email: testEmail });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should not save user when email is not given", async () => {
			const testPassword = "Aa@123456";

			const res = await request
				.post("/user/login")
				.send({ password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should not return user if email entered does not exist in db", async () => {
			const testEmail = "a.adfshiu@vcet.edu.in";
			const testPassword = "Aa@123456";

			const res = await request
				.post("/user/login")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should not return user if password entered does not exist in db", async () => {
			const res = await request
				.post("/user/login")
				.send({ email: testEmail, password: "sdg1Arew2" });

			expect(res.body.success).toEqual(false);
			expect(res.status).toEqual(401);
		});

		it("should login the user and return a jwt token", async () => {
			const res = await request
				.post("/user/login")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(true);
			expect(res.body.token).toBeDefined;
			expect(res.status).toEqual(201);
		});
	});

	describe.skip("POST /user/getUserProfileStatus", () => {
		const testEmail = "a.123456789@vcet.edu.in";
		const testPassword = "Aa1@bcdqwe";

		afterEach(async () => await deleteDummyUser());

		beforeEach(async () => {
			token = await createDummyUser(testEmail, testPassword);
		});

		it("should return the data with success and isProfileComplete", async () => {
			const res = await request
				.post("/user/getUserProfileStatus")
				.set("Authorization", `Bearer ${token}`)
				.send();

			expect(res.body.success).toBe(true);
			expect(res.body.data).toBeDefined();
			expect(res.body.data.isProfileComplete).toBeDefined();
			expect(res.status).toEqual(201);
		});

		it("should return 401 if user token is wrong", async () => {
			const res = await request
				.post("/user/getUserProfileStatus")
				.set("Authorization", `Bearer ${token + "a"}`)
				.send();

			expect(res.body.success).toBe(false);
			expect(res.status).toBe(401);
		});
	});
});
