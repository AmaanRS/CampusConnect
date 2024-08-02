import mongoose from "mongoose";
import dotenv from "dotenv";
import { startServer } from "../../app";
import {
	// AccountType,
	// Department,
	// IUser,
	// Position,
	// Year,
} from "../../Types/GeneralTypes";
import { faker } from "@faker-js/faker";
import {
	getRandomEnumValue,
	generatePassword,
	getRandomEnumValueFromYear,
} from "../../Utils/util";
import { userModel } from "../../Models/User";
import { AccountType, IUser } from "../../Types/ModelTypes";
dotenv.config();

jest.mock("mongoose");

//In all the test cases below i have checked if invalid cases throw error but have not checked if valid cases work write it in github issues

describe("User model", () => {
	let randomYear: Year;
	let randomDepartment: Department;
	let randomAccountType: AccountType;
	let randomPosition: Position;

	beforeAll(async () => {
		const mockConnection = jest.fn().mockResolvedValueOnce({
			connection: {
				db: {
					databaseName: "CampusConnectSelf",
				},
			},
		});

		(mongoose.connect as jest.Mock) = mockConnection;
		await startServer(
			process.env.MONGO_URI!,
			process.env.PORT!,
			process.env.REPL_SET!,
		);
	});

	//use done or return for async code
	afterAll((done) => {
		mongoose.disconnect();
		jest.clearAllMocks();
		done();
	});

	beforeEach(() => {
		randomYear = getRandomEnumValueFromYear(Year);
		randomDepartment = getRandomEnumValue(Department);
		randomAccountType = getRandomEnumValue(AccountType);
		randomPosition = getRandomEnumValue(Position);
	});

	// it("should only save data if it follows schema constraints", async () => {
	// 	const UserObject: IUser = {
	// 		username: faker.person.fullName(),
	// 		email: faker.internet.email({ allowSpecialCharacters: true }),
	// 		password: generatePassword(),
	// 		year: randomYear,
	// 		division: faker.string.alpha({ length: 1, casing: "upper" }),
	// 		department: randomDepartment,
	// 		studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 		accType: randomAccountType,
	// 		position: randomPosition,
	// 		isProfileComplete: faker.datatype.boolean(),
	// 	};

	// 	const User = new userModel({ ...UserObject });

	// 	await expect(User.validate()).toBeDefined
	// });

	it("should not save user with invalid email format and throw ERROR", async () => {
		const testEmail = "invalid-email-format";

		const UserObject: IUser = {
			email: testEmail,
			password: generatePassword(),
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });
		await expect(User.validate()).rejects.toThrow("Invalid email format");
	});

	it("should not save user with invalid division and throw ERROR", async () => {
		const testDivision = [
			//Length not 1 case
			faker.string.alpha({
				length: { min: 2, max: 3 },
				casing: "upper",
			}),
			//String not uppercase case
			faker.string.alpha({
				length: 1,
				casing: "lower",
			}),
		];

		const testAccType = AccountType.Student;

		for (let i = 0; i < testDivision.length; i++) {
			const UserObject: IUser = {
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: generatePassword(),
				accType: testAccType,
				division: testDivision[i],
				year: randomYear,
				department: randomDepartment,
				studentId: faker.number.int({ min: 100000000, max: 999999999 }),
				isProfileComplete: faker.datatype.boolean(),
			};

			const User = new userModel({ ...UserObject });
			await expect(User.validate()).rejects.toThrow(
				"Division must be a single uppercase letter",
			);
		}
	});

	it("should not save user with invalid studentId and throw ERROR", async () => {
		//Invalid number constraints case
		const testStudentId = [
			faker.number.int({
				min: 0,
				max: 100000,
			}),
			faker.number.int({
				min: 1000000000,
			}),
		];

		for (let i = 0; i < testStudentId.length; i++) {
			const UserObject: IUser = {
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: generatePassword(),
				year: randomYear,
				division: faker.string.alpha({ casing: "upper" }),
				department: randomDepartment,
				accType: AccountType.Student,
				studentId: testStudentId[i],
				isProfileComplete: faker.datatype.boolean(),
			};

			const User = new userModel({ ...UserObject });
			await expect(User.validate()).rejects.toThrow(
				"Invalid student ID format.",
			);
		}
	});

	it("should not save user if Account Type is Student and position is set and throw ERROR", async () => {
		const testAccType = AccountType.Student;

		const UserObject: IUser = {
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			position: randomPosition,
			department: randomDepartment,
			isProfileComplete: faker.datatype.boolean(),
		};
		const User = new userModel({ ...UserObject });

		expect(User.validate()).rejects.toThrow(
			"With Account Type as Student position cannot be set",
		);
	});

	it("should not save user if User's Account type is not given but other optional fields are given and throw ERROR", async () => {
		const UserObject: IUser = {
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			department: randomDepartment,
			position: randomPosition,
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });

		await expect(User.validate()).rejects.toThrow(
			"Account Type is required without which other optional fields cannot be set",
		);
	});

	it("should not save user if User's Account type is NonTeachingStaff and position is not LabIncharge and throw ERROR", async () => {
		const testAccType = AccountType.NonTeachingStaff;
		const testPosition =
			randomPosition !== Position.LabIncharge ? randomPosition : Position.HOD;

		const UserObject: IUser = {
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			position: testPosition,
			department: randomDepartment,
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });

		await expect(User.validate()).rejects.toThrow(
			"With Account Type as NonTeachingStaff position should be LabIncharge",
		);
	});

	it("should not save user if User's Account type is Admin or NonTeachingStaff or Teacher and year is given and throw ERROR", async () => {
		const testAccType =
			randomAccountType !== AccountType.Student &&
			randomAccountType !== AccountType.NonTeachingStaff
				? randomAccountType
				: AccountType.Teacher;

		const UserObject: IUser = {
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			year: randomYear,
			department: randomDepartment,
			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
			division: faker.string.alpha({ length: 1, casing: "upper" }),
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });

		await expect(User.validate()).rejects.toThrow(
			"With Account Type as Admin, NonTeachingStaff, Teacher  year cannot be given",
		);
	});

	it.each([
		{ missingField: "division", fieldName: "division" },
		{ missingField: "department", fieldName: "department" },
		{ missingField: "studentId", fieldName: "studentId" },
	])(
		"should throw error if year is set but $fieldName is missing",
		async ({ missingField }) => {
			const testAccType = AccountType.Student;

			const UserObject: IUser = {
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: generatePassword(),
				accType: testAccType,
				year: randomYear,
				department: randomDepartment,
				studentId: faker.number.int({ min: 100000000, max: 999999999 }),
				division: faker.string.alpha({ length: 1, casing: "upper" }),
				isProfileComplete: faker.datatype.boolean(),
			};

			// Remove the specific field for the test case
			delete UserObject[missingField as keyof IUser];

			const User = new userModel({ ...UserObject });

			expect(User.validate()).rejects.toThrow(
				"If year is set then division, department, studentId should also be set",
			);
		},
	);

	it("should throw error if year is set and position is also set", async () => {
		const testAccType = AccountType.Teacher;

		const userObject: IUser = {
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			year: randomYear, // Ensure year is set
			department: randomDepartment,
			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
			division: faker.string.alpha({ length: 1, casing: "upper" }),
			isProfileComplete: faker.datatype.boolean(),
			position: Position.LabIncharge, // Ensure position is also set
		};

		const user = new userModel({ ...userObject });

		await expect(user.validate()).rejects.toThrow(
			"If year is set then position should not be set",
		);
	});

	// This test case will not work because of this code 'enum: Object.values(Year).filter((v) => typeof v === "number"),' in user schema
	// it.each([
	// 	{ yearValue: "1ST", errorMessage: "Year should be a number" },
	// 	{ yearValue: 0, errorMessage: "Year should be between 1 and 4" },
	// 	{ yearValue: 5, errorMessage: "Year should be between 1 and 4" },
	// ])(
	// 	"should throw error if year is not a number or is not between 1 and 4",
	// 	async ({ yearValue, errorMessage }) => {
	// 		const testAccType = AccountType.Student;

	// 		const userObject = {
	// 			email: faker.internet.email({ allowSpecialCharacters: true }),
	// 			password: generatePassword(),
	// 			accType: testAccType,
	// 			year: yearValue,
	// 			department: randomDepartment,
	// 			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 			division: faker.string.alpha({ length: 1, casing: "upper" }),
	// 			isProfileComplete: faker.datatype.boolean(),
	// 		};

	// 		const user = new userModel({ ...userObject });

	// 		await expect(user.validate()).rejects.toThrow(errorMessage);
	// 	},
	// );

	it.each([{ missingField: "year", fieldName: "year" }])(
		"should throw error if division is set but $fieldName is missing",
		async ({ missingField }) => {
			const testAccType = AccountType.Student;

			// Create a base user object
			const baseUserObject: IUser = {
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: generatePassword(),
				accType: testAccType,
				year: randomYear,
				department: randomDepartment,
				studentId: faker.number.int({ min: 100000000, max: 999999999 }),
				division: faker.string.alpha({ length: 1, casing: "upper" }),
				isProfileComplete: faker.datatype.boolean(),
			};

			// Remove the specific field for the test case if it's missing
			if (missingField) {
				delete baseUserObject[missingField as keyof IUser];
			}

			const user = new userModel({ ...baseUserObject });

			await expect(user.validate()).rejects.toThrow(
				"If division is set then year, department, studentId should be set and position should be unset AND year should be a number between 1 and 4",
			);
		},
	);
});
