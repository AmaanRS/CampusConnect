import { Request, Response } from "express";
import {
	AccountType,
	Department,
	IStudent,
	StudentPosition,
	Year,
} from "../Types/ModelTypes";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
	TokenResponse,
} from "../Types/GeneralTypes";
import { runWithRetrySession } from "../Utils/util";
import { userModel } from "../Models/User";
import { studentModel } from "../Models/Student";
import { createJwtToken } from "../Utils/jwtToken";
import { commentModel } from "../Models/Comment";

const createStudent = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			department,
			year,
		}: {
			decodedToken: decodedTokenPayload;
			department: Department;
			year: Year;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!department || !year) {
			const response: StandardResponse = {
				message: "Give department and year",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Get the user from db
			const userFromDb = await userModel
				.findOne({ email }, { __v: 0 })
				.session(session)
				.lean();

			if (!userFromDb) {
				const response: StandardResponse = {
					message: "User is not signed up",
					success: false,
				};

				return response;
			}

			// const { _id: userId, ...user } = userFromDb;

			// Passing old objectId ensures that objectid remains same
			const userId = userFromDb._id;
			const { ...user } = userFromDb;

			const changedUser = await userModel.updateOne(
				{ _id: userId },
				{
					isProfileComplete: true,
				},
				{ session },
			);

			if (!changedUser.acknowledged) {
				const response: StandardResponse = {
					message: "User not updated for isProfileCompleted",
					success: false,
				};

				return response;
			}

			let newStudentData = { ...user, year: year };
			newStudentData.department = department;

			const newStudent: IStudent[] = await studentModel.create(
				[newStudentData],
				{
					session,
				},
			);

			if (!newStudent || newStudent.length === 0) {
				const response: StandardResponse = {
					message: "Could not create new student while creating stuent",
					success: false,
				};

				return response;
			}

			//Create a jwt token
			const isTokenCreated = createJwtToken(newStudent[0]);

			if (!isTokenCreated.success) {
				const response: StandardResponse = {
					message: "JWT token could not be created",
					success: false,
				};

				return response;
			}

			if (isTokenCreated.success && "token" in isTokenCreated) {
				let token: string = isTokenCreated.token;

				const response: TokenResponse = {
					message: "Student creation successfull",
					success: true,
					token: token,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Token was created but could not be sent",
				success: false,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while creating the student's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getStudentById = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenPayload } = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const isAdmin = decodedToken.accountType === AccountType.Admin;

		const student = await studentModel
			.findOne(
				{ email },
				{ password: 0 },
				{ _skipInactiveStudentsHook: isAdmin },
			)
			.populate([
				{
					path: "postsLiked",
				},
				{
					path: "committeePositions.committeeObjId",
				},
			])
			.lean();

		if (!student) {
			const response: StandardResponse = {
				message: "Could not find student",
				success: false,
			};
			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Found student successfully",
			success: true,
			data: student,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while fetching the student's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const updateStudent = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			department,
			year,
		}: {
			decodedToken: decodedTokenPayload;
			department: Department;
			year: Year;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		if (!department && !year) {
			const response: StandardResponse = {
				message: "Give department or year to update",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			//Get the student from db
			const oldStudent = await studentModel
				.findOne({ email }, { __v: 0 })
				.session(session)
				.lean();

			if (!oldStudent) {
				const response: StandardResponse = {
					message: "Could not find the student",
					success: false,
				};

				return response;
			}

			// Delete the old one
			const isoldStudentDeleted = await studentModel
				.deleteOne({ email })
				.session(session);

			if (!isoldStudentDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the student while updating",
					success: false,
				};

				return response;
			}

			const dataForUpdatedStudent = oldStudent;

			// If department exists then set it
			if (department) dataForUpdatedStudent.department = department;

			// If year exists then set it
			if (year) dataForUpdatedStudent.year = year;

			const updatedStudent = await studentModel.create(
				[dataForUpdatedStudent],
				{ session },
			);

			if (!updatedStudent || updatedStudent.length === 0) {
				const response: StandardResponse = {
					message: "Could not update the student while updating",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Updated student successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating the studnet's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const deleteStudent = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			studentEmail,
		}: { decodedToken: decodedTokenPayload; studentEmail: string | undefined } =
			req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		if (!studentEmail) {
			const response: StandardResponse = {
				message: "Give student email",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		// Make account inactive instead of deleting it
		const result = await runWithRetrySession(async (session) => {
			const user = await studentModel
				.findOne({ email: studentEmail })
				.session(session);

			if (!user) {
				const response: StandardResponse = {
					message: "Could not find the student",
					success: false,
				};

				return response;
			}

			const isUserStudentIncharge = user.committeePositions?.some(
				(committeePosition) => {
					return (
						committeePosition.position ===
						StudentPosition.StudentIncharge
					);
				},
			);

			if (isUserStudentIncharge) {
				const response: StandardResponse = {
					message:
						"The user is a student incharge of the committee, please replace him from the student incharge position then delete him",
					success: false,
				};

				return response;
			}

			const isStudentDeleted = await studentModel
				.updateOne({ email: studentEmail }, { isAccountActive: false })
				.session(session);

			if (!isStudentDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the student",
					success: false,
				};

				return response;
			}

			const isUserDeleted = await userModel
				.updateOne({ email: studentEmail }, { isAccountActive: false })
				.session(session);

			if (!isUserDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the student",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Student deleted successfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while deleting student's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getAllStudents = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
		}: {
			decodedToken: decodedTokenPayload | undefined;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};

			return res.status(401).json(response);
		}

		const isAdmin = decodedToken.accountType === AccountType.Admin;

		const allStudents = await studentModel
			.find({}, null, {
				_skipInactiveStudentsHook: isAdmin,
			})
			.lean();

		if (!allStudents || allStudents.length === 0) {
			const response: DataResponse = {
				message: "No student found",
				success: true,
				data: [],
			};

			return res.status(201).json(response);
		}

		const response: DataResponse = {
			message: "All students fetched successfully",
			success: true,
			data: allStudents,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching all students" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getAllStudentData = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
		}: {
			decodedToken: decodedTokenPayload | undefined;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};

			return res.status(401).json(response);
		}

		const studentData = await studentModel
			.findOne({ email }, { password: 0 })
			.populate("committeePositions.committeeObjId");

		if (!studentData) {
			const response: StandardResponse = {
				message: "Student not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Student found successfully",
			success: true,
			data: studentData,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching all the data of student" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getAllStudentsEmail = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
		}: {
			decodedToken: decodedTokenPayload | undefined;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};

			return res.status(401).json(response);
		}

		const emails = await userModel
			.find({ accType: AccountType.Student }, { email: 1, _id: 0 })
			.lean();

		if (!Array.isArray(emails) || emails.length === 0) {
			const response: DataResponse = {
				message: "No student emails found in db",
				success: true,
				data: [],
			};

			return res.status(201).json(response);
		}

		const response: DataResponse = {
			message: "Emails of students found successfully",
			success: false,
			data: emails,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching all email of students" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export {
	createStudent,
	getStudentById,
	updateStudent,
	deleteStudent,
	getAllStudents,
	getAllStudentData,
	getAllStudentsEmail,
};
