import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import mongoose, { ClientSession, Types } from "mongoose";
import {
	connectToTestDbAndStartTestServer,
	stopTestServerRunning,
} from "../Tests/TestServer";
import {
	AccountType,
	ICommitteeDocument,
	IStudentDocument,
	ITeacherDocument,
	StudentPosition,
	TeacherPosition,
} from "../Types/ModelTypes";
import { studentModel } from "../Models/Student";

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
// export function generatePassword(): string {
// 	const lowerCase = faker.string.alpha({ length: 1, casing: "lower" });
// 	const upperCase = faker.string.alpha({ length: 1, casing: "upper" });
// 	const number = faker.string.numeric(1);
// 	const specialChar = faker.helpers.arrayElement([
// 		"@",
// 		"$",
// 		"!",
// 		"%",
// 		"*",
// 		"?",
// 		"&",
// 	]);
// 	const otherChars = faker.string.alphanumeric({ length: 4 });

// 	const passwordArray = [lowerCase, upperCase, number, specialChar, ...otherChars];
// 	faker.helpers.shuffle(passwordArray);

// 	return passwordArray.join("");
// }

// Wrapper function for session management
export const runWithRetrySession = async (
	operation: (session: ClientSession) => Promise<any>,
	maxRetries: number = 2,
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
					setTimeout(
						resolve,
						Math.pow(2, retryCount) * (Math.random() + 100) * 7,
					),
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

const checkIfFacultyOrStudentInchargeOfCommitteeFunc = ({
	decodedToken,
	studentInchargeEmail,
	facultyInchargeEmail,
}: {
	decodedToken: decodedTokenPayload;
	studentInchargeEmail: string;
	facultyInchargeEmail: string;
}): StandardResponse | DataResponse => {
	try {
		if (decodedToken.accountType === AccountType.Teacher) {
			//Check if FacultyIncharge, is incharge of the committee she is trying to update
			if (facultyInchargeEmail !== decodedToken.email) {
				const response: StandardResponse = {
					message:
						"You must be the faculty incharge of the given committee",
					success: false,
				};

				return response;
			}

			const response: DataResponse = {
				message: "The user is a teacher Incharge",
				success: true,
				data: TeacherPosition.FacultyIncharge,
			};

			return response;
		} else if (decodedToken.accountType === AccountType.Student) {
			//Check if StudentIncharge is incharge of the committee she is trying to update
			if (studentInchargeEmail !== decodedToken.email) {
				const response: StandardResponse = {
					message:
						"You must be the student incharge of the given committee",
					success: false,
				};

				return response;
			}

			const response: DataResponse = {
				message: "The user is a student Incharge",
				success: true,
				data: StudentPosition.StudentIncharge,
			};

			return response;
		} else {
			const response: StandardResponse = {
				message:
					"You must be teacher Incharge or student incharge of the given committee",
				success: false,
			};

			return response;
		}
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while checking for studentIncharge and facultyIncharge " +
				(e as Error).message,
			success: false,
		};

		return response;
	}
};

const updateStudentInchargeOfCommittee = async ({
	studentInchargeEmail,
	committee: oldCommittee,
	session,
	newDataForCommittee,
}: {
	studentInchargeEmail: string | undefined;
	committee: mongoose.FlattenMaps<
		Omit<ICommitteeDocument, "studentIncharge" | "facultyIncharge"> & {
			facultyIncharge: ITeacherDocument;
			studentIncharge: IStudentDocument;
		}
	>;
	session: mongoose.mongo.ClientSession;
	newDataForCommittee: ICommitteeDocument;
}) => {
	if (studentInchargeEmail) {
		// If the old StudentIncharge email is same as new StudentIncharge email
		if (oldCommittee.studentIncharge.email === studentInchargeEmail) {
			const response: StandardResponse = {
				message:
					"Cannot update since old email and email to update of studentIncharge is same",
				success: false,
			};
			return response;
		}
		// Does new studentIncharge exists in db
		const newStudentIncharge = await studentModel
			.findOne({
				email: studentInchargeEmail,
			})
			.session(session)
			.lean();

		if (!newStudentIncharge) {
			const response: StandardResponse = {
				message: "Could not find the student while updating",
				success: false,
			};
			return response;
		}

		// Set the objId of new studentIncharge
		if (mongoose.isValidObjectId(newStudentIncharge._id)) {
			newDataForCommittee.studentIncharge =
				newStudentIncharge._id as mongoose.Types.ObjectId;
		} else {
			const response: StandardResponse = {
				message: "Could not set the student while updating",
				success: false,
			};
			return response;
		}

		let newDataForOldStudentIncharge = oldCommittee.studentIncharge;

		// Remove the anything related to this committee from student doc
		newDataForOldStudentIncharge.committeePositions =
			newDataForOldStudentIncharge.committeePositions?.filter(
				(committeePosition) => {
					return (
						committeePosition.committeeObjId?.toString() !==
						(oldCommittee._id as Types.ObjectId).toString()
					);
				},
			);

		const isOldStudentInchargeDeleted = await studentModel
			.deleteOne({ _id: oldCommittee.studentIncharge._id })
			.session(session);

		if (!isOldStudentInchargeDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the old student incharge while updating",
				success: false,
			};
			return response;
		}

		// Create oldStudentIncharge with studentIncharge position removed
		const isOldStudentInchargeCreated = await studentModel.create(
			[newDataForOldStudentIncharge],
			{ session },
		);

		if (
			!Array.isArray(isOldStudentInchargeCreated) ||
			isOldStudentInchargeCreated.length === 0
		) {
			const response: StandardResponse = {
				message:
					"Could not create the old student with remove studentIncharge position while updating",
				success: false,
			};
			return response;
		}

		// Add studentIncharge to new studentIncharge's committeePositions
		const newDataForNewStudentIncharge = newStudentIncharge;

		// If committeePositions is undefined make it an empty array
		if (!newDataForNewStudentIncharge.committeePositions) {
			newDataForNewStudentIncharge.committeePositions = [];
		}

		// Remove the anything related to this committee from student doc
		newDataForNewStudentIncharge.committeePositions =
			newDataForNewStudentIncharge.committeePositions.filter(
				(committeePosition) => {
					return (
						committeePosition.committeeObjId?.toString() !==
						(oldCommittee._id as Types.ObjectId).toString()
					);
				},
			);

		// Add position as studentIncharge in committeePositions of newStudentIncharge
		newDataForNewStudentIncharge.committeePositions.push({
			committeeObjId: oldCommittee._id as Types.ObjectId,
			position: StudentPosition.StudentIncharge,
		});

		// Delete the studentIncharge
		const isStudentInchargeDeleted = await studentModel
			.deleteOne({ _id: newStudentIncharge._id })
			.session(session);

		if (!isStudentInchargeDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the student while updating",
				success: false,
			};
			return response;
		}

		const isNewUpdatedStudentInchargeCreated = await studentModel.create(
			[newDataForNewStudentIncharge],
			{ session },
		);

		if (!isNewUpdatedStudentInchargeCreated) {
			const response: StandardResponse = {
				message:
					"Could not create the new Updated student with added studentIncharge position while updating",
				success: false,
			};
			return response;
		}

		// Remove the studentIncharge from members array
		newDataForCommittee.members = newDataForCommittee.members?.filter(
			(member) => {
				return (
					member.toString() !==
					(oldCommittee.studentIncharge._id as Types.ObjectId).toString()
				);
			},
		);

		const response: StandardResponse = {
			message: "Updated studentIncharge successfully",
			success: true,
		};
		return response;
	} else {
		const response: StandardResponse = {
			message:
				"You must be teacher Incharge or student incharge of the given committee to update",
			success: false,
		};

		return response;
	}
};

const runTestServer = async () => {
	console.log("Connecting to local test db");

	await connectToTestDbAndStartTestServer(
		process.env["LOCAL_TEST_MONGO_URI"]!,
		process.env["PORT"]!,
		process.env["REPL_SET"]!,
	);
};

const stopTestServer = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await stopTestServerRunning();
};

export {
	runTestServer,
	stopTestServer,
	checkIfFacultyOrStudentInchargeOfCommitteeFunc,
	updateStudentInchargeOfCommittee,
};
