import { adminModel } from "../../Models/Admin";
import { nonTeachingStaffModel } from "../../Models/NonTeachingStaff";
import {
	AccountType,
	Department,
	NonTeachingStaffPosition,
} from "../../Types/ModelTypes";
import { checkPassAgainstDbPass } from "../../Utils/util";
import { startServer } from "../../app";

describe.only("Admin Model Tests", () => {
	beforeAll(async () => {
		await startServer(
			process.env.MONGO_URI!,
			process.env.PORT!,
			process.env.REPL_SET!,
		);
	});

	afterEach(async () => {
		await adminModel.deleteOne({});
	});

	const testCases = [
		{
			name: "Valid non-teaching NonTeachingStaff with unique positions",
			data: {
				email: "staff1@domain.com",
				password: "Passw@123",
				department: Department.IT,
				accType: AccountType.NonTeachingStaff,
				position: [NonTeachingStaffPosition.NonTeachingStaff],
				isProfileComplete: true,
			},
			shouldThrow: false,
		},
		{
			name: "Invalid email format",
			data: {
				email: "staff1@domain",
				password: "Passw@123",
				department: Department.IT,
				accType: AccountType.NonTeachingStaff,
				position: [NonTeachingStaffPosition.NonTeachingStaff],
				isProfileComplete: true,
			},
			shouldThrow: true,
		},
		{
			name: "Empty position",
			data: {
				email: "staff2@domain.com",
				password: "Passw@123",
				department: Department.IT,
				accType: AccountType.NonTeachingStaff,
				position: [],
				isProfileComplete: true,
			},
			shouldThrow: true,
		},
		{
			name: "Position with duplicate values",
			data: {
				email: "staff3@domain.com",
				password: "Passw@123",
				department: Department.IT,
				accType: AccountType.NonTeachingStaff,
				position: [
					NonTeachingStaffPosition.NonTeachingStaff,
					NonTeachingStaffPosition.NonTeachingStaff,
				],
				isProfileComplete: true,
			},
			shouldThrow: false,
		},
		{
			name: "Password should be hashed",
			data: {
				email: "staff4@domain.com",
				password: "Passw@123",
				department: Department.IT,
				accType: AccountType.NonTeachingStaff,
				position: [NonTeachingStaffPosition.NonTeachingStaff],
				isProfileComplete: true,
			},
			shouldThrow: false,
		},
	];

	it.each(testCases)("$name", async ({ data, shouldThrow }) => {
		if (shouldThrow) {
			await expect(nonTeachingStaffModel.create(data)).rejects.toThrow();
		} else {
			const NonTeachingStaff = await nonTeachingStaffModel.create(data);

			expect(NonTeachingStaff).toBeDefined();

			expect(NonTeachingStaff.email).toBe(data.email);

			expect(NonTeachingStaff.department).toBe(data.department);

			expect(NonTeachingStaff.accType).toBe(data.accType);

			expect(NonTeachingStaff.position).toEqual([...new Set(data.position)]);

			expect(
				(
					await checkPassAgainstDbPass(
						data.password,
						NonTeachingStaff.password,
					)
				).success,
			).toBe(true);

			if (data.isProfileComplete !== undefined) {
				expect(NonTeachingStaff.isProfileComplete).toBe(
					data.isProfileComplete,
				);
			}
		}
	});
});
