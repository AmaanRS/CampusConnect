import { app, startServer } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { generatePassword } from "../../Utils/util";
import { before } from "node:test";

dotenv.config();
let token: any = "";

describe("User Controller", () => {
	beforeAll(async () => {
		await startServer(
			process.env.MONGO_URI!,
			process.env.PORT!,
			process.env.REPL_SET!,
		);
	});

	describe.skip("POST /signup", () => {
		//Uncomment it later because it creates users on just testing other test cases

		// it("should save user to database on valid email and password", async () => {
		// 	const testEmail = faker.internet.email();
		// 	const testPassword = generatePassword();

		// 	const res = await request
		// 		.post("/signup")
		// 		.send({ email: testEmail, password: testPassword });

		// 	expect(res.body.success).toEqual(true);
		// 	expect(res.body.message).toEqual(
		// 		"Your account has been created now you can login",
		// 	);
		// });

		it("should not save user when password is not given", async () => {
			const testEmail = faker.internet.email();

			const res = await request.post("/signup").send({ email: testEmail });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual("Enter both email and password");
		});

		it("should not save user when email is not given", async () => {
			const testPassword = generatePassword();

			const res = await request
				.post("/signup")
				.send({ password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual("Enter both email and password");
		});

		it("should not save user when password does not follow the validations", async () => {
			const testEmail = faker.internet.email();

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
					.post("/signup")
					.send({ email: testEmail, password: testPasswords[i] });

				expect(res.body.success).toEqual(false);
				expect(res.body.message).toEqual(
					"Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long",
				);
			}
		});

		it("should not save user when email is invalid", async () => {
			const testEmail = "ajioj.wq";
			const testPassword = generatePassword();

			const res = await request
				.post("/signup")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual("Invalid email format");
		});

		it("should not save user when email is duplicate", async () => {
			//While testing this case remember that testEmail should be a email which already exists in db
			const testEmail = "a@b.com";
			const testPassword = generatePassword();

			const res = await request
				.post("/signup")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual("email_1 dup key");
		});
	});

	describe.skip("POST /login", () => {
		it("should not save user when password is not given", async () => {
			const testEmail = faker.internet.email();

			const res = await request.post("/login").send({ email: testEmail });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual("Enter both email and password");
		});

		it("should not save user when email is not given", async () => {
			const testPassword = generatePassword();

			const res = await request
				.post("/login")
				.send({ password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual("Enter both email and password");
		});

		it("should not return user if email entered does not exist in db", async () => {
			// While testing make sure the email should not exist in db
			const testEmail = faker.internet.email();
			const testPassword = generatePassword();

			const res = await request
				.post("/login")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual(
				"Either email or password entered is wrong",
			);
		});

		it("should not return user if password entered does not exist in db", async () => {
			// While testing make sure the email  exists in db and password does not
			const testEmail = "a@b.com";
			const testPassword = generatePassword();

			const res = await request
				.post("/login")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(false);
			expect(res.body.message).toEqual(
				"Either email or password entered is wrong",
			);
		});

		it("should login the user and return a jwt token", async () => {
			// The email and password should be correct and should exist in db
			const testEmail = "a@aa.com";
			const testPassword = "Aa1@bcdqwe";

			const res = await request
				.post("/login")
				.send({ email: testEmail, password: testPassword });

			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("You have been logged in successfully");
			expect(res.body.token).toBeDefined;
		});
	});

	describe.skip("POST /getUserProfileStatus", () => {
		before(async () => {
			//Make sure this email and password exists in db
			const res = await request
				.post("/login")
				.send({ email: "a@aa.com", password: "Aa1@bcdqwe" });
			token = res.body.success === true ? res.body.token : null;
		});

		it("should return the data with message,success and isProfileComplete", async () => {
			const res = await request
				.post("/getUserProfileStatus")
				.set("Authorization", `Bearer ${token}`);

			expect(res.body.success).toBe(true);
			expect(res.body.data).toBeDefined();
			expect(res.body.data.isProfileComplete).toBeDefined();
		});

		it("should return 401 if user token is wrong", async () => {
			const res = await request
				.post("/getUserProfileStatus")
				.set("Authorization", `Bearer ${token + "a"}`);
			expect(res.body.success).toBe(false);
			expect(res.status).toBe(401);
		});
	});
});
