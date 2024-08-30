import { faker } from "@faker-js/faker";
import { StandardResponse } from "../Types/GeneralTypes";
import mongoose, { ClientSession } from "mongoose";
import {
	connectToTestDbAndStartTestServer,
	stopTestServerRunning,
} from "../Tests/TestServer";

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

// Wrapper function for session management
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
			return result;
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

const runTestServer = async () => {
	await connectToTestDbAndStartTestServer(
		process.env.MONGO_URI!,
		process.env.PORT!,
		// process.env.REPL_SET!,ww
	);
};

const stopTestServer = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await stopTestServerRunning();
};

export { runTestServer, stopTestServer };
