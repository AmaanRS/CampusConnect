import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";
import { MongooseError } from "mongoose";

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

export const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// At least one lowercase letter
// At least one uppercase letter
// At least one digit
// At least one special character
// Total length between 8 and 10 characters
export const passwordRegex: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

async function validatePassword(password: string) {
	if (!password) {
		const response: StandardResponse = {
			message: "Password should be given for validation",
			success: false,
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

async function createHashValue(text: string):Promise<StandardResponse | DataResponse> {
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

	let isHashCreated = await createHashValue(text) as DataResponse;

	if (!isHashCreated.success) {
		throw new MongooseError(isHashCreated.message);
	}

	// Here the data is gaurenteed to be string
	return isHashCreated.data as string
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
}
