import { MongooseError } from "mongoose";
import dotenv from "dotenv";
import { startServer } from "../../app";
import {} from // AccountType,
// Department,
// IUser,
// Position,
// Year,
"../../Types/GeneralTypes";
// import {
// 	getRandomEnumValue,
// 	getRandomEnumValueFromYear,
// } from "../../Utils/util";
import { userModel } from "../../Models/User";
import { TeacherPosition } from "../../Types/ModelTypes";
dotenv.config();

// jest.mock("mongoose");

//In all the test cases below i have checked if invalid cases throw error but have not checked if valid cases work write it in github issues

describe("User model", () => {
	// let randomYear: Year;
	// let randomDepartment: Department;
	// let randomAccountType: AccountType;
	// let randomPosition: Position;

	beforeAll(async () => {
		// const mockConnection = jest.fn().mockResolvedValueOnce({
		// 	connection: {
		// 		db: {
		// 			databaseName: "CampusConnectSelf",
		// 		},
		// 	},
		// });

		// (mongoose.connect as jest.Mock) = mockConnection;
		await startServer(
			process.env.MONGO_URI!,
			process.env.PORT!,
			process.env.REPL_SET!,
		);
	});

	//use done or return for async code
	// afterAll((done) => {
	// 	mongoose.disconnect();
	// 	jest.clearAllMocks();
	// 	done();
	// });

	beforeEach(() => {
		// randomYear = getRandomEnumValueFromYear(Year);
		// randomDepartment = getRandomEnumValue(Department);
		// randomAccountType = getRandomEnumValue(AccountType);
		// randomPosition = getRandomEnumValue(Position);
	});

	afterEach(async () => {
		await userModel.deleteMany({});
	});

	// Don't clear this commented code
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

	// it("should not save user with invalid email format and throw ERROR", async () => {
	// 	const testEmail = "invalid-email-format";

	// 	const UserObject: IUser = {
	// 		email: testEmail,
	// 		password: generatePassword(),
	// 		isProfileComplete: faker.datatype.boolean(),
	// 	};

	// 	const User = new userModel({ ...UserObject });
	// 	await expect(User.validate()).rejects.toThrow("Invalid email format");
	// });

	// it("should not save user with invalid division and throw ERROR", async () => {
	// 	const testDivision = [
	// 		//Length not 1 case
	// 		faker.string.alpha({
	// 			length: { min: 2, max: 3 },
	// 			casing: "upper",
	// 		}),
	// 		//String not uppercase case
	// 		faker.string.alpha({
	// 			length: 1,
	// 			casing: "lower",
	// 		}),
	// 	];

	// 	const testAccType = AccountType.Student;

	// 	for (let i = 0; i < testDivision.length; i++) {
	// 		const UserObject: IUser = {
	// 			email: faker.internet.email({ allowSpecialCharacters: true }),
	// 			password: generatePassword(),
	// 			accType: testAccType,
	// 			division: testDivision[i],
	// 			year: randomYear,
	// 			department: randomDepartment,
	// 			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 			isProfileComplete: faker.datatype.boolean(),
	// 		};

	// 		const User = new userModel({ ...UserObject });
	// 		await expect(User.validate()).rejects.toThrow(
	// 			"Division must be a single uppercase letter",
	// 		);
	// 	}
	// });

	// it("should not save user with invalid studentId and throw ERROR", async () => {
	// 	//Invalid number constraints case
	// 	const testStudentId = [
	// 		faker.number.int({
	// 			min: 0,
	// 			max: 100000,
	// 		}),
	// 		faker.number.int({
	// 			min: 1000000000,
	// 		}),
	// 	];

	// 	for (let i = 0; i < testStudentId.length; i++) {
	// 		const UserObject: IUser = {
	// 			email: faker.internet.email({ allowSpecialCharacters: true }),
	// 			password: generatePassword(),
	// 			year: randomYear,
	// 			division: faker.string.alpha({ casing: "upper" }),
	// 			department: randomDepartment,
	// 			accType: AccountType.Student,
	// 			studentId: testStudentId[i],
	// 			isProfileComplete: faker.datatype.boolean(),
	// 		};

	// 		const User = new userModel({ ...UserObject });
	// 		await expect(User.validate()).rejects.toThrow(
	// 			"Invalid student ID format.",
	// 		);
	// 	}
	// });

	// it.only("should not save user if Account Type is Student and position is set and throw ERROR", async () => {
	// 	const testAccType = AccountType.Student;

	// 	const UserObject: IUser = {
	// 		email: faker.internet.email({ allowSpecialCharacters: true }),
	// 		password: generatePassword(),
	// 		accType: testAccType,
	// 		position: randomPosition,
	// 		department: randomDepartment,
	// 		isProfileComplete: faker.datatype.boolean(),
	// 	};
	// 	const User = new userModel({ ...UserObject });

	// 	expect(User.validate()).rejects.toThrow(
	// 		"With Account Type as Student position cannot be set",
	// 	);
	// });

	// it("should not save user if User's Account type is not given but other optional fields are given and throw ERROR", async () => {
	// 	const UserObject: IUser = {
	// 		email: faker.internet.email({ allowSpecialCharacters: true }),
	// 		password: generatePassword(),
	// 		department: randomDepartment,
	// 		position: randomPosition,
	// 		isProfileComplete: faker.datatype.boolean(),
	// 	};

	// 	const User = new userModel({ ...UserObject });

	// 	await expect(User.validate()).rejects.toThrow(
	// 		"Account Type is required without which other optional fields cannot be set",
	// 	);
	// });

	// it("should not save user if User's Account type is NonTeachingStaff and position is not LabIncharge and throw ERROR", async () => {
	// 	const testAccType = AccountType.NonTeachingStaff;
	// 	const testPosition =
	// 		randomPosition !== Position.LabIncharge ? randomPosition : Position.HOD;

	// 	const UserObject: IUser = {
	// 		email: faker.internet.email({ allowSpecialCharacters: true }),
	// 		password: generatePassword(),
	// 		accType: testAccType,
	// 		position: testPosition,
	// 		department: randomDepartment,
	// 		isProfileComplete: faker.datatype.boolean(),
	// 	};

	// 	const User = new userModel({ ...UserObject });

	// 	await expect(User.validate()).rejects.toThrow(
	// 		"With Account Type as NonTeachingStaff position should be LabIncharge",
	// 	);
	// });

	// it("should not save user if User's Account type is Admin or NonTeachingStaff or Teacher and year is given and throw ERROR", async () => {
	// 	const testAccType =
	// 		randomAccountType !== AccountType.Student &&
	// 		randomAccountType !== AccountType.NonTeachingStaff
	// 			? randomAccountType
	// 			: AccountType.Teacher;

	// 	const UserObject: IUser = {
	// 		email: faker.internet.email({ allowSpecialCharacters: true }),
	// 		password: generatePassword(),
	// 		accType: testAccType,
	// 		year: randomYear,
	// 		department: randomDepartment,
	// 		studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 		division: faker.string.alpha({ length: 1, casing: "upper" }),
	// 		isProfileComplete: faker.datatype.boolean(),
	// 	};

	// 	const User = new userModel({ ...UserObject });

	// 	await expect(User.validate()).rejects.toThrow(
	// 		"With Account Type as Admin, NonTeachingStaff, Teacher  year cannot be given",
	// 	);
	// });

	// it.each([
	// 	{ missingField: "division", fieldName: "division" },
	// 	{ missingField: "department", fieldName: "department" },
	// 	{ missingField: "studentId", fieldName: "studentId" },
	// ])(
	// 	"should throw error if year is set but $fieldName is missing",
	// 	async ({ missingField }) => {
	// 		const testAccType = AccountType.Student;

	// 		const UserObject: IUser = {
	// 			email: faker.internet.email({ allowSpecialCharacters: true }),
	// 			password: generatePassword(),
	// 			accType: testAccType,
	// 			year: randomYear,
	// 			department: randomDepartment,
	// 			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 			division: faker.string.alpha({ length: 1, casing: "upper" }),
	// 			isProfileComplete: faker.datatype.boolean(),
	// 		};

	// 		// Remove the specific field for the test case
	// 		delete UserObject[missingField as keyof IUser];

	// 		const User = new userModel({ ...UserObject });

	// 		expect(User.validate()).rejects.toThrow(
	// 			"If year is set then division, department, studentId should also be set",
	// 		);
	// 	},
	// );

	// it("should throw error if year is set and position is also set", async () => {
	// 	const testAccType = AccountType.Teacher;

	// 	const userObject: IUser = {
	// 		email: faker.internet.email({ allowSpecialCharacters: true }),
	// 		password: generatePassword(),
	// 		accType: testAccType,
	// 		year: randomYear, // Ensure year is set
	// 		department: randomDepartment,
	// 		studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 		division: faker.string.alpha({ length: 1, casing: "upper" }),
	// 		isProfileComplete: faker.datatype.boolean(),
	// 		position: Position.LabIncharge, // Ensure position is also set
	// 	};

	// 	const user = new userModel({ ...userObject });

	// 	await expect(user.validate()).rejects.toThrow(
	// 		"If year is set then position should not be set",
	// 	);
	// });

	// // This test case will not work because of this code 'enum: Object.values(Year).filter((v) => typeof v === "number"),' in user schema
	// // it.each([
	// // 	{ yearValue: "1ST", errorMessage: "Year should be a number" },
	// // 	{ yearValue: 0, errorMessage: "Year should be between 1 and 4" },
	// // 	{ yearValue: 5, errorMessage: "Year should be between 1 and 4" },
	// // ])(
	// // 	"should throw error if year is not a number or is not between 1 and 4",
	// // 	async ({ yearValue, errorMessage }) => {
	// // 		const testAccType = AccountType.Student;

	// // 		const userObject = {
	// // 			email: faker.internet.email({ allowSpecialCharacters: true }),
	// // 			password: generatePassword(),
	// // 			accType: testAccType,
	// // 			year: yearValue,
	// // 			department: randomDepartment,
	// // 			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// // 			division: faker.string.alpha({ length: 1, casing: "upper" }),
	// // 			isProfileComplete: faker.datatype.boolean(),
	// // 		};

	// // 		const user = new userModel({ ...userObject });

	// // 		await expect(user.validate()).rejects.toThrow(errorMessage);
	// // 	},
	// // );

	// it.each([{ missingField: "year", fieldName: "year" }])(
	// 	"should throw error if division is set but $fieldName is missing",
	// 	async ({ missingField }) => {
	// 		const testAccType = AccountType.Student;

	// 		// Create a base user object
	// 		const baseUserObject: IUser = {
	// 			email: faker.internet.email({ allowSpecialCharacters: true }),
	// 			password: generatePassword(),
	// 			accType: testAccType,
	// 			year: randomYear,
	// 			department: randomDepartment,
	// 			studentId: faker.number.int({ min: 100000000, max: 999999999 }),
	// 			division: faker.string.alpha({ length: 1, casing: "upper" }),
	// 			isProfileComplete: faker.datatype.boolean(),
	// 		};

	// 		// Remove the specific field for the test case if it's missing
	// 		if (missingField) {
	// 			delete baseUserObject[missingField as keyof IUser];
	// 		}

	// 		const user = new userModel({ ...baseUserObject });

	// 		await expect(user.validate()).rejects.toThrow(
	// 			"If division is set then year, department, studentId should be set and position should be unset AND year should be a number between 1 and 4",
	// 		);
	// 	},
	// );

	const validUserData = {
		email: "valid_email@vcet.edu.in",
		password: "sPaas123!",
		isProfileComplete: true,
	};

	const testCases = [
		// Valid Cases
		{
			name: "valid HOD email",
			data: { ...validUserData, email: "hod_it@vcet.edu.in" },
			shouldThrow: false,
		},
		{
			name: "valid student email",
			data: { ...validUserData, email: "an.212254101@vcet.edu.in" },
			shouldThrow: false,
		},
		{
			name: "valid teacher email",
			data: { ...validUserData, email: "ash.van@vcet.edu.in" },
			shouldThrow: false,
		},
		{
			name: "valid email with special chars",
			data: { ...validUserData, email: "a.n.123@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "valid HOD with lowercase department",
			data: { ...validUserData, email: "hod_it@vcet.edu.in" },
			shouldThrow: false,
		},
		{
			name: "invalid student with digits in name",
			data: { ...validUserData, email: "a1.n.123456789@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid teacher with digits",
			data: { ...validUserData, email: "ash1.van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid teacher with dots",
			data: { ...validUserData, email: "ash.v.an@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid HOD with mixed case",
			data: { ...validUserData, email: "HoD_it@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid student with mixed case",
			data: { ...validUserData, email: "An.212254101@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid teacher with mixed case",
			data: { ...validUserData, email: "Ash.Van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "valid non-teaching staff",
			data: {
				...validUserData,
				email: "non.teaching@vcet.edu.in",
				position: [TeacherPosition.Teacher],
			},
			shouldThrow: false,
		},

		// Invalid Cases
		{
			name: "non-vcet email",
			data: { ...validUserData, email: "invalid@gmail.com" },
			shouldThrow: true,
		},
		{
			name: "invalid HOD email format",
			data: { ...validUserData, email: "hod_123@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid student email format",
			data: { ...validUserData, email: "an.12345@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid teacher email format",
			data: { ...validUserData, email: "ashvan@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "missing email",
			data: { ...validUserData, email: "" },
			shouldThrow: true,
		},
		{
			name: "missing password",
			data: { ...validUserData, password: "" },
			shouldThrow: true,
		},
		{
			name: "invalid email pattern",
			data: { ...validUserData, email: "invalid-email-format" },
			shouldThrow: true,
		},
		{
			name: "HOD without department part",
			data: { ...validUserData, email: "hod_@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "HOD with number department",
			data: { ...validUserData, email: "hod_123@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "student without dot",
			data: { ...validUserData, email: "an212254101@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "student with short ID",
			data: { ...validUserData, email: "an.12345@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "teacher without dot",
			data: { ...validUserData, email: "ashvan@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "teacher with underscore",
			data: { ...validUserData, email: "ash_van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "email with both dot and underscore",
			data: { ...validUserData, email: "ash_v.an@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "invalid department value",
			data: {
				...validUserData,
				email: "hod_unknown@vcet.edu.in",
				department: "unknown",
			},
			shouldThrow: true,
		},
		{
			name: "invalid account type value",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				accType: "unknown",
			},
			shouldThrow: false,
		},
		{
			name: "position not an array",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				position: "Teacher",
			},
			shouldThrow: false,
		},
		{
			name: "position array with invalid value",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				position: ["unknown"],
			},
			shouldThrow: false,
		},
		{
			name: "password too short",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				password: "short",
			},
			shouldThrow: true,
		},
		{
			name: "password without numbers",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				password: "NoNumbers!",
			},
			shouldThrow: true,
		},
		{
			name: "password without special characters",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				password: "NoSpecial123",
			},
			shouldThrow: true,
		},
		{
			name: "password without uppercase letters",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				password: "nouppercase123!",
			},
			shouldThrow: true,
		},
		{
			name: "password without lowercase letters",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				password: "NOLOWERCASE123!",
			},
			shouldThrow: true,
		},
		{
			name: "duplicate email",
			data: { ...validUserData, email: "duplicate.123456789@vcet.edu.in" },
			setup: async () => {
				await new userModel({
					...validUserData,
					email: "duplicate.123456789@vcet.edu.in",
				}).save();
			},
			shouldThrow: true,
		},
		{
			name: "missing department for non-student",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				department: undefined,
			},
			shouldThrow: false,
		},
		{
			name: "non-boolean isProfileComplete",
			data: {
				...validUserData,
				email: "ash.van@vcet.edu.in",
				isProfileComplete: "yes",
			},
			shouldThrow: false,
		},
		{
			name: "invalid email domain",
			data: { ...validUserData, email: "ash.van@invalid.com" },
			shouldThrow: true,
		},
		{
			name: "teacher email without name part",
			data: { ...validUserData, email: ".van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "HOD email with invalid department",
			data: { ...validUserData, email: "hod_invalid@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "student email with too many digits",
			data: { ...validUserData, email: "an.2122541011@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "teacher email with too many dots",
			data: { ...validUserData, email: "a.s.h.v.a.n@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "HOD email with special chars in department",
			data: { ...validUserData, email: "hod_i!t@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "student email with invalid chars",
			data: { ...validUserData, email: "a.n.2*21254101@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "teacher email with invalid chars",
			data: { ...validUserData, email: "a$h.van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "non-string email",
			data: { ...validUserData, email: 12345 },
			shouldThrow: true,
		},
		{
			name: "non-string password",
			data: { ...validUserData, password: 12345678 },
			shouldThrow: true,
		},
		{
			name: "non-string department",
			data: { ...validUserData, department: 123 },
			shouldThrow: true,
		},
		{
			name: "non-array position",
			data: { ...validUserData, position: "Teacher" },
			shouldThrow: true,
		},
		{
			name: "non-boolean isProfileComplete",
			data: { ...validUserData, isProfileComplete: "yes" },
			shouldThrow: true,
		},
		{
			name: "email with trailing space",
			data: { ...validUserData, email: "ash.van@vcet.edu.in " },
			shouldThrow: true,
		},
		{
			name: "email with leading space",
			data: { ...validUserData, email: " ash.van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "email with double dots",
			data: { ...validUserData, email: "ash..van@vcet.edu.in" },
			shouldThrow: true,
		},
		{
			name: "email with consecutive underscores",
			data: { ...validUserData, email: "ash__van@vcet.edu.in" },
			shouldThrow: true,
		},
	];

	it.each(testCases)("should $name", async ({ data, shouldThrow, setup }) => {
		if (setup) {
			await setup();
			const user = new userModel(data);
			await expect(user.save()).rejects.toThrow();
		} else {
			const user = new userModel(data);
			if (shouldThrow) {
				await expect(user.save()).rejects.toThrow(MongooseError);
			} else {
				await expect(user.save()).resolves.toBeDefined();
			}
		}
	});
});
