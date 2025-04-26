import bcrypt from "bcrypt";
import { MongooseError } from "mongoose";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";
import { hashStringRegex, passwordRegex } from "./regexUtils";

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

export async function checkPassAgainstDbPass(
	password: string,
	dbPassword: string,
): Promise<StandardResponse> {
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
