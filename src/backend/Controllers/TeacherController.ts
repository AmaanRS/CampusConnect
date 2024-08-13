import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenFromBody,
	StandardResponse,
} from "../Types/GeneralTypes";
import { onlyHodEmailRegex, onlyTeacherEmailRegex } from "../Utils/regexUtils";
import { runWithRetrySession } from "../Utils/util";
import { userModel } from "../Models/User";
import { teacherModel } from "../Models/Teacher";
import { Department, ITeacher } from "../Types/ModelTypes";

// Creates teacher using user jwt token
const createTeacher = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenFromBody } = req.body;

		let department: Department | undefined = req.body.department;

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

		// If user is hod remove department given from user since it should already exist in user
		if (onlyHodEmailRegex.test(email)) {
			department = undefined;
		}
		// If the user is teacher and department is not given or department is not string
		else if (onlyTeacherEmailRegex.test(email)) {
			if (!department || typeof department !== "string") {
				const response: StandardResponse = {
					message: "Give department",
					success: false,
				};
				return res.status(401).json(response);
			}
		}
		// If the user is not teacher
		else if (!onlyTeacherEmailRegex.test(email)) {
			const response: StandardResponse = {
				message:
					"The email should be of hod or teacher to signup as a teacher",
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

			const { _id: userId, ...user } = userFromDb;

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

			let newTeacherData = user;

			//If department property does not exists on user in db then user is teacher else if department property exists then user is hod
			if (!user.department) newTeacherData.department = department;

			const newTeacher: ITeacher[] = await teacherModel.create(
				[newTeacherData],
				{
					session,
				},
			);

			if (!newTeacher || newTeacher.length === 0) {
				const response: StandardResponse = {
					message: "Could not create new teacher while creating teacher",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Teacher creation successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while creating the teacher's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Gets the teacher whose jwt token is given
const getTeacher = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenFromBody } = req.body;

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

		console.log(await teacherModel.find({}));

		const teacher: ITeacher | null = await teacherModel.findOne(
			{ email },
			{ password: 0 },
		);

		if (!teacher) {
			const response: StandardResponse = {
				message: "Could not find teacher",
				success: false,
			};
			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Found teacher successfully",
			success: true,
			data: teacher,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while fetching the teacher's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

//
// position, isInChargeOfCommittees, isInTeamOfCommittees will be updated using create committee, delete committee and some other api's
//

// Use nanoid as isInChargeOfCommittees, isInTeamOfCommittees id since exposing mongodb objectid can raise security issues
// Cannot update email or password through this function
// Updates the teacher whose jwt token is given
const updateTeacher = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			department,
		}: {
			decodedToken: decodedTokenFromBody;
			department: Department;
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

		if (!department) {
			const response: StandardResponse = {
				message: "Give department",
				success: false,
			};
			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			//Get the teacher from db
			const oldTeacher = await teacherModel
				.findOne({ email }, { __v: 0, _id: 0 })
				.session(session)
				.lean();

			if (!oldTeacher) {
				const response: StandardResponse = {
					message: "Could not find the teacher",
					success: false,
				};

				return response;
			}

			// Delete the old one
			const isOldTeacherDeleted = await teacherModel
				.deleteOne({ email })
				.session(session);

			if (!isOldTeacherDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the teacher while updating",
					success: false,
				};

				return response;
			}

			const dataForUpdatedTeacher = oldTeacher;

			const updatedTeacher = await teacherModel.create(
				[dataForUpdatedTeacher],
				{ session },
			);

			if (!updatedTeacher || updatedTeacher.length === 0) {
				const response: StandardResponse = {
					message: "Could not update the teacher while updating",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Updating teacher successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating the teacher's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Deletes the teacher whose jwt token is given
const deleteTeacher = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenFromBody } = req.body;

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

		const isTeacherDeleted = await teacherModel.deleteOne({ email: email });

		if (!isTeacherDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the teacher",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (isTeacherDeleted.deletedCount === 0) {
			const response: StandardResponse = {
				message: "Could not find the teacher to delete",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Teacher deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while deleting teachers's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export { createTeacher, getTeacher, updateTeacher, deleteTeacher };
