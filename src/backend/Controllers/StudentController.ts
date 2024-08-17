import { Request, Response } from "express";
import { Department, IStudent, Year } from "../Types/ModelTypes";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { runWithRetrySession } from "../Utils/util";
import { userModel } from "../Models/User";
import { studentModel } from "../Models/Student";

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

			const response: StandardResponse = {
				message: "Student creation successfull",
				success: true,
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

const getStudent = async (req: Request, res: Response) => {
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

		const student: IStudent | null = await studentModel.findOne(
			{ email },
			{ password: 0 },
		);

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

		const isStudentDeleted = await studentModel.deleteOne({ email: email });

		if (!isStudentDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the student",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (isStudentDeleted.deletedCount === 0) {
			const response: StandardResponse = {
				message: "Could not find the student to delete",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Student deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
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

export { createStudent, getStudent, updateStudent, deleteStudent };
