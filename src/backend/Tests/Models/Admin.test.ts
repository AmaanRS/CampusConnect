import { adminModel } from "../../Models/Admin";
import { AccountType, AdminPosition } from "../../Types/ModelTypes";
import { checkPassAgainstDbPass } from "../../Utils/passwordUtils";
import { runTestServer, stopTestServer } from "../../Utils/util";

describe.only("Admin Model Tests", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await adminModel.deleteOne({});
	});

	const testCases = [
		{
			name: "Valid admin with unique positions",
			data: {
				email: "admin1@domain.com",
				password: "Passw@123",
				accType: AccountType.Admin,
				position: [AdminPosition.Admin],
				isProfileComplete: true,
			},
			shouldThrow: false,
		},
		{
			name: "Invalid email format",
			data: {
				email: "admin1@domain",
				password: "Passw@123",
				accType: AccountType.Admin,
				position: [AdminPosition.Admin],
				isProfileComplete: true,
			},
			shouldThrow: true,
		},
		{
			name: "Empty position",
			data: {
				email: "admin2@domain.com",
				password: "Passw@123",
				accType: AccountType.Admin,
				position: [],
				isProfileComplete: true,
			},
			shouldThrow: true,
		},
		{
			name: "Position with duplicate values",
			data: {
				email: "admin3@domain.com",
				password: "Passw@123",
				accType: AccountType.Admin,
				position: [AdminPosition.Admin, AdminPosition.Admin],
				isProfileComplete: true,
			},
			shouldThrow: false,
		},
		{
			name: "Password should be hashed",
			data: {
				email: "admin4@domain.com",
				password: "Passw@123",
				accType: AccountType.Admin,
				position: [AdminPosition.Admin],
				isProfileComplete: true,
			},
			shouldThrow: false,
		},
	];

	it.each(testCases)("$name", async ({ data, shouldThrow }) => {
		if (shouldThrow) {
			await expect(adminModel.create(data)).rejects.toThrow();
		} else {
			const admin = await adminModel.create(data);

			expect(admin).toBeDefined();

			expect(admin.email).toBe(data.email);

			expect(admin.accType).toBe(data.accType);

			expect(admin.position).toEqual([...new Set(data.position)]);

			expect(
				(await checkPassAgainstDbPass(data.password, admin.password))
					.success,
			).toBe(true);

			if (data.isProfileComplete !== undefined) {
				expect(admin.isProfileComplete).toBe(data.isProfileComplete);
			}
		}
	});
});
