import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { Department, ICommittee } from "../Types/ModelTypes";
import { runWithRetrySession } from "../Utils/util";
import { studentModel } from "../Models/Student";
import { teacherModel } from "../Models/Teacher";
import { committeeModel } from "../Models/Committee";
import mongoose from "mongoose";

// TODO: There should be only one committee of the same name
const createCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			name,
			description,
			studentIncharge: studentInchargeEmail,
			facultyInchargeEmail,
			committeeOfDepartment,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			name: string | undefined;
			description: string | undefined;
			studentIncharge: string | undefined;
			facultyInchargeEmail: string | undefined;
			committeeOfDepartment: Department[] | undefined;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const adminEmail = decodedToken.email;

		if (!adminEmail) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (
			!name ||
			!description ||
			!studentInchargeEmail ||
			!facultyInchargeEmail ||
			!committeeOfDepartment ||
			committeeOfDepartment.length === 0
		) {
			const response: StandardResponse = {
				message:
					"Send name, description, studentIncharge, committeeOfDepartment for committee creation",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Get the objectId from studentIncharge
			const studentId = await studentModel
				.findOne({ email: studentInchargeEmail }, { _id: 1 })
				.session(session)
				.lean();

			if (!studentId) {
				const response: StandardResponse = {
					message: "Could not find the student incharge",
					success: false,
				};

				return response;
			}

			// Get the objectId from facultyIncharge
			const teacherId = await teacherModel
				.findOne({ email: facultyInchargeEmail }, { _id: 1 })
				.session(session)
				.lean();

			if (!teacherId) {
				const response: StandardResponse = {
					message: "Could not find the teacher incharge",
					success: false,
				};

				return response;
			}

			const newCommittee: ICommittee[] = await committeeModel.create(
				[
					{
						name,
						description,
						studentIncharge: studentId,
						facultyIncharge: teacherId,
						committeeOfDepartment,
					},
				],
				{ session },
			);

			if (!newCommittee || newCommittee.length === 0) {
				const response: StandardResponse = {
					message: "Could not create new committee",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Created committee successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while creating committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
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

		if (!committeeId) {
			const response: StandardResponse = {
				message: "Committee id is required to get an committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		const committee = await committeeModel
			.findOne({ committeeId: committeeId })
			.lean();

		if (!committee) {
			const response: StandardResponse = {
				message: "Committee not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Committee found successfully",
			success: false,
			data: committee,
		};

		return res.status(401).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while creating committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const updateCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
			description,
			studentIncharge: studentInchargeEmail,
			facultyInchargeEmail,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
			description: string | undefined;
			studentIncharge: string | undefined;
			facultyInchargeEmail: string | undefined;
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

		if (!committeeId) {
			const response: StandardResponse = {
				message: "Committee id is required to get an committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!description && !studentInchargeEmail && !facultyInchargeEmail) {
			const response: StandardResponse = {
				message: "Give some data to update committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Old committee data
			const oldCommittee = await committeeModel
				.findOne({ committeeId })
				.session(session)
				.lean();

			if (!oldCommittee) {
				const response: StandardResponse = {
					message: "Could not find the committee",
					success: false,
				};

				return res.status(401).json(response);
			}

			// Delete the old committee
			const isOldCommitteeDeleted = await committeeModel
				.deleteOne({
					committeeId,
				})
				.session(session);

			if (!isOldCommitteeDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the committee while updating",
					success: false,
				};

				return res.status(401).json(response);
			}

			const newDataForCommittee = oldCommittee;

			if (description) {
				newDataForCommittee.description = description;
			}

			if (studentInchargeEmail) {
				const newStudentIncharge = await studentModel
					.findOne(
						{
							email: studentInchargeEmail,
						},
						{ _id: 1 },
					)
					.session(session);

				if (!newStudentIncharge) {
					const response: StandardResponse = {
						message: "Could not find the student while updating",
						success: false,
					};

					return res.status(401).json(response);
				}

				if (mongoose.isValidObjectId(newStudentIncharge._id)) {
					newDataForCommittee.studentIncharge =
						newStudentIncharge._id as mongoose.Types.ObjectId;
				} else {
					const response: StandardResponse = {
						message: "Could not set the student while updating",
						success: false,
					};

					return res.status(401).json(response);
				}
			}

			if (facultyInchargeEmail) {
				const facultyIncharge = await teacherModel
					.findOne(
						{
							email: facultyInchargeEmail,
						},
						{ _id: 1 },
					)
					.session(session);

				if (!facultyIncharge) {
					const response: StandardResponse = {
						message: "Could not find the teacher while updating",
						success: false,
					};

					return res.status(401).json(response);
				}

				if (mongoose.isValidObjectId(facultyIncharge._id)) {
					newDataForCommittee.facultyIncharge =
						facultyIncharge._id as mongoose.Types.ObjectId;
				} else {
					const response: StandardResponse = {
						message: "Could not set the teacher while updating",
						success: false,
					};

					return res.status(401).json(response);
				}
			}
			// Create a new committee
			const newCommittee = await committeeModel.create([newDataForCommittee], {
				session,
			});

			if (!newCommittee || newCommittee.length === 0) {
				const response: StandardResponse = {
					message: "Could not create a new committee while updating",
					success: false,
				};

				return res.status(401).json(response);
			}

			const response: StandardResponse = {
				message: "Committee updated successfully",
				success: true,
			};

			return res.status(201).json(response);
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const deleteCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
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

		if (!committeeId) {
			const response: StandardResponse = {
				message: "Committee id is required to get an committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		//
		//TODO: While deleting committee make changes to all other models since commitee is referenced in many places
		//
		const isCommitteeDeleted = await committeeModel
			.deleteOne({ committeeId })
			.lean();

		if (!isCommitteeDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Committee deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while deleting committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

//TODO : Write this function properly
//TODO: Write with pagination
const getAllCommittees = async (req: Request, res: Response) => {
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

		const allCommittees = await committeeModel.find();

		if (!allCommittees || allCommittees.length === 0) {
			const response: StandardResponse = {
				message: "No committee found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "All Committees fetched successfully",
			success: true,
			data: allCommittees,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching all committees" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export {
	createCommittee,
	getCommittee,
	updateCommittee,
	deleteCommittee,
	getAllCommittees,
};
