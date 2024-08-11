import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";
import mongoose, { MongooseError, ClientSession } from "mongoose";

// Function for returning a random value from enum
export function getRandomEnumValue<T extends { [key: string]: string | number }>(
	enumObj: T,
): T[keyof T] {
	const enumValues = Object.values(enumObj);
	const randomIndex = Math.floor(Math.random() * enumValues.length);
	return enumValues[randomIndex] as T[keyof T];
}

// Function for returning a random value from YEAR enum
export function getRandomEnumValueFromYear<
	T extends { [key: string]: string | number },
>(enumObj: T): T[keyof T] {
	const enumValues = Object.values(enumObj);
	const filteredValues = enumValues.filter((value) => typeof value === "number");
	// console.log("utils" + "  " + enumValues +"  "+filteredValues);
	const randomIndex = Math.floor(Math.random() * filteredValues.length);
	return filteredValues[randomIndex] as T[keyof T];
}

//Function to generate random password
export function generatePassword(): string {
	const lowerCase = faker.string.alpha({ length: 1, casing: "lower" });
	const upperCase = faker.string.alpha({ length: 1, casing: "upper" });
	const number = faker.string.numeric(1);
	const specialChar = faker.helpers.arrayElement([
		"@",
		"$",
		"!",
		"%",
		"*",
		"?",
		"&",
	]);
	const otherChars = faker.string.alphanumeric({ length: 4 });

	const passwordArray = [lowerCase, upperCase, number, specialChar, ...otherChars];
	faker.helpers.shuffle(passwordArray);

	return passwordArray.join("");
}

// This is bcrypt specific regex for hash
export const hashStringRegex =
	/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{22}[./A-Za-z0-9]{31}$/;

export const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userEmailRegex =
	/^(hod_[a-zA-Z]+|[a-z]+\.[a-z]+|[a-z]+\.[0-9]{9})@vcet\.edu\.in$/;

export const studentEmailRegex: RegExp = /^([a-z]+\.[0-9]{9})@vcet\.edu\.in$/;

export const teacherEmailRegex: RegExp =
	/^(hod_[a-zA-Z]+|[a-z]+\.[a-z]+)@vcet\.edu\.in$/;

// At least one lowercase letter
// At least one uppercase letter
// At least one digit
// At least one special character
// Total length between 8 and 10 characters
export const passwordRegex: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

async function validatePassword(
	password: string,
): Promise<StandardResponse | DataResponse> {
	if (!password) {
		const response: StandardResponse = {
			message: "Password should be given for validation",
			success: false,
		};
		return response;
	}

	if (hashStringRegex.test(password)) {
		const response: DataResponse = {
			message: "Password is already hashed",
			success: true,
			data: password,
		};
		return response;
	}

	const isPassValid = passwordRegex.test(password);

	if (!isPassValid) {
		const response: StandardResponse = {
			message:
				"Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long",
			success: false,
		};
		return response;
	}

	const response: StandardResponse = {
		message: "Password is valid",
		success: true,
	};
	return response;
}

async function createHashValue(
	text: string,
): Promise<StandardResponse | DataResponse> {
	if (!text) {
		const response: StandardResponse = {
			message: "Cannot create a hash of null,undefined,empty string",
			success: false,
		};
		return response;
	}
	const hashedText: string = await bcrypt.hash(text, 8);

	const response: DataResponse = {
		message: "Hash created successfully",
		success: true,
		data: hashedText,
	};
	return response;
}

export async function validateAndHash(text: string) {
	const isPassValid = await validatePassword(text);

	if (!isPassValid.success) {
		throw new MongooseError(isPassValid.message);
	}

	if ("data" in isPassValid && isPassValid.data && isPassValid.success) {
		// Since password is already hashed
		return isPassValid.data as string;
	} else {
		let isHashCreated = (await createHashValue(text)) as DataResponse;

		if (!isHashCreated.success) {
			throw new MongooseError(isHashCreated.message);
		}

		// Here the data is gaurenteed to be string
		return isHashCreated.data as string;
	}
}

export async function checkPassAgainstDbPass(password: string, dbPassword: string) {
	if (!password || !dbPassword) {
		const response: StandardResponse = {
			message: "Password cannot be null,undefined or empty string",
			success: false,
		};
		return response;
	}

	let matchPassword = await bcrypt.compare(password, dbPassword);

	if (!matchPassword) {
		const response: StandardResponse = {
			message: "Either email or password entered is wrong",
			success: false,
		};

		return response;
	}

	const response: StandardResponse = {
		message: "The password matches",
		success: true,
	};

	return response;
}

export const runWithRetrySession = async (
	operation: (session: ClientSession) => Promise<any>,
	maxRetries: number = 4,
) => {
	const session = await mongoose.startSession();
	let retryCount = 0;
	let successful = false;
	let result: StandardResponse;

	while (retryCount < maxRetries && !successful) {
		try {
			session.startTransaction();
			result = await operation(session);

			if (!result.success) {
				await session.abortTransaction();
				await session.endSession();
				return result;
			}

			await session.commitTransaction();
			await session.endSession();

			successful = true;
			return result
		} catch (e) {
			console.log((e as Error).message);
			if (session.inTransaction()) {
				await session.abortTransaction();
			}

			// Only for Write Conflict
			// 112 is the MongoDB WriteConflict error code
			if (e instanceof mongoose.mongo.MongoError && e.code === 112) {
				retryCount++;
				console.log(`Retry ${retryCount}/${maxRetries}`);

				// Exponential backoff
				await new Promise((resolve) =>
					setTimeout(resolve, Math.pow(2, retryCount) * 500),
				);
			} else {
				await session.endSession();
				throw e;
			}
		}
	}
	const response: StandardResponse = {
		message: "Operation failed after maximum retries",
		success: false,
	};

	if (session.inTransaction()) {
		await session.abortTransaction();
	}
	await session.endSession();

	if (!successful) {
		throw new Error("Operation failed after maximum retries");
	}

	return response;
};
