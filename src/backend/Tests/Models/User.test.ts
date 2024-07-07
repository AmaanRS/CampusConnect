import mongoose from "mongoose";
import dotenv from "dotenv";
import { startServer } from "../../app";
import { AccountType, Department, IUser, Position, Year } from "../../BackendTypes";
import { faker } from "@faker-js/faker";
import {
	getRandomEnumValue,
	generatePassword,
	getRandomEnumValueFromYear,
} from "../../Utils/util";
import { userModel } from "../../Models/User";
dotenv.config();

jest.mock("mongoose");

// For Password
// At least one lowercase letter
// At least one uppercase letter
// At least one digit
// At least one special character
// Total length between 8 and 10 characters

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
		await startServer(process.env.MONGO_URI!, process.env.PORT!);
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
			username: faker.person.fullName(),
			email: testEmail,
			password: generatePassword(),
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });
		await expect(User.validate()).rejects.toThrow("Invalid email format");
	});

	it("should not save user if password does not follow constraints and throw ERROR", async () => {
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
			const UserObject: IUser = {
				username: faker.person.fullName(),
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: testPasswords[i],
				isProfileComplete: faker.datatype.boolean(),
			};

			const User = new userModel({ ...UserObject });
			await expect(User.validate()).rejects.toThrow(
				"Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long.",
			);
		}
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

		const testAccType = AccountType.Teacher;

		for (let i = 0; i < testDivision.length; i++) {
			const UserObject: IUser = {
				username: faker.person.fullName(),
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: generatePassword(),
				accType: testAccType,
				division: testDivision[i],
				isProfileComplete: faker.datatype.boolean(),
			};

			const User = new userModel({ ...UserObject });
			await expect(User.validate()).rejects.toThrow(
				"Division must be a single uppercase letter",
			);
		}
	});

	it("should not save studentId when account type is not Student and throw ERROR", async () => {
		//Any account type other than student when given should not save studentId
		const testAccType =
			randomAccountType !== AccountType.Student &&
			randomAccountType !== AccountType.NonTeachingStaff
				? randomAccountType
				: AccountType.Teacher;

		const UserObject: IUser = {
			username: faker.person.fullName(),
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });

		await expect(User.validate()).rejects.toThrow(
			"With Account Type other than Student studentId cannot be set",
		);
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
				username: faker.person.fullName(),
				email: faker.internet.email({ allowSpecialCharacters: true }),
				password: generatePassword(),
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
			username: faker.person.fullName(),
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			position: randomPosition,
			isProfileComplete: faker.datatype.boolean(),
		};
		const User = new userModel({ ...UserObject });

		expect(User.validate()).rejects.toThrow(
			"With Account Type as Student position cannot be set",
		);
	});

	it("should not save user if User's Account type is not given but other optional fields are given and throw ERROR", async () => {
		const UserObject: IUser = {
			username: faker.person.fullName(),
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

	it("should not save user if User's Account type is Admin and Division is given and throw ERROR", async () => {
		const testAccType = AccountType.Admin;

		const UserObject: IUser = {
			username: faker.person.fullName(),
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			division: faker.string.alpha({ length: 1, casing: "upper" }),
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });

		await expect(User.validate()).rejects.toThrow(
			"With Account Type as Admin division cannot be set",
		);
	});

	it("should not save user if User's Account type is NonTeachingStaff and position is not LabIncharge and throw ERROR", async () => {
		const testAccType = AccountType.NonTeachingStaff;
		const testPosition =
			randomPosition !== Position.LabIncharge ? randomPosition : Position.HOD;

		const UserObject: IUser = {
			username: faker.person.fullName(),
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			position: testPosition,
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
			username: faker.person.fullName(),
			email: faker.internet.email({ allowSpecialCharacters: true }),
			password: generatePassword(),
			accType: testAccType,
			year: randomYear,
			isProfileComplete: faker.datatype.boolean(),
		};

		const User = new userModel({ ...UserObject });

		await expect(User.validate()).rejects.toThrow(
			"With Account Type as Admin, NonTeachingStaff, Teacher position year cannot be given",
		);
	});
});
