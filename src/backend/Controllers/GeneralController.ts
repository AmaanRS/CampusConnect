import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { adminModel } from "../Models/Admin";
import { teacherModel } from "../Models/Teacher";
import {
	CommitteeStatus,
	IStudentDocument,
	ITeacherDocument,
	TeacherPosition,
} from "../Types/ModelTypes";
import { IAdmin } from "../Types/ModelTypes";
import { committeeModel } from "../Models/Committee";
import { runWithRetrySession } from "../Utils/util";
import { Types } from "mongoose";

const getAllPendingCommitteesFunc = async (
	decodedToken: decodedTokenPayload | undefined,
): Promise<StandardResponse | DataResponse> => {
	if (!decodedToken) {
		const response: StandardResponse = {
			message: "User is not authenticated",
			success: false,
		};
		return response;
	}

	const email = decodedToken.email;

	if (!email) {
		const response: StandardResponse = {
			message: "User is not authenticated",
			success: false,
		};

		return response;
	}

	let user: IAdmin | null;

	user = await adminModel.findOne({ email: email });

	if (!user) {
		const response: StandardResponse = {
			message: "The user should be admin",
			success: false,
		};

		return response;
	}

	const pendingCommittees = await committeeModel.find(
		{
			status: CommitteeStatus.PENDING,
		},
		null,
		{ _skipPendingCheckInHook: true, _skipDeletingCheckInHook: true },
	);

	if (!Array.isArray(pendingCommittees) || pendingCommittees.length === 0) {
		const response: StandardResponse = {
			message: "No pending committees found",
			success: false,
		};

		return response;
	}

	const response: DataResponse = {
		message: "Successfully found pending committees",
		success: true,
		data: pendingCommittees,
	};

	return response;
};

const getAllPendingCommittees = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
		}: {
			decodedToken: decodedTokenPayload | undefined;
		} = req.body;

		const result = await getAllPendingCommitteesFunc(decodedToken);

		if (!result.success || !("data" in result)) {
			const response: StandardResponse = {
				message: result.message,
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Successfully found pending committees",
			success: true,
			data: result.data,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while getting pending committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getAllDeletedCommittees = async (req: Request, res: Response) => {
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

		let user: IAdmin | null;

		user = await adminModel.findOne({ email: email });

		if (!user) {
			const response: StandardResponse = {
				message: "The user should be admin",
				success: false,
			};

			return res.status(401).json(response);
		}

		const deletedCommittees = await committeeModel.find(
			{
				status: CommitteeStatus.DELETED,
			},
			null,
			{ _skipPendingCheckInHook: true, _skipDeletingCheckInHook: true },
		);

		if (!Array.isArray(deletedCommittees) || deletedCommittees.length === 0) {
			const response: StandardResponse = {
				message: "No deleted committees found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Successfully found pending committees",
			success: true,
			data: deletedCommittees,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while getting pending committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// TODO: Complete and check his api
// const actionOnPendingCommittee = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			decodedToken,
// 			committeeId,
// 			actionOnPendingCommittee,
// 		}: {
// 			decodedToken: decodedTokenPayload | undefined;
// 			committeeId: string | undefined;
// 			actionOnPendingCommittee: CommitteeStatus | undefined;
// 		} = req.body;

// 		if (!decodedToken) {
// 			const response: StandardResponse = {
// 				message: "User is not authenticated",
// 				success: false,
// 			};
// 			return res.status(401).json(response);
// 		}

// 		const email = decodedToken.email;

// 		if (!email) {
// 			const response: StandardResponse = {
// 				message: "User is not authenticated",
// 				success: false,
// 			};

// 			return res.status(401).json(response);
// 		}

// 		if (!committeeId) {
// 			const response: StandardResponse = {
// 				message:
// 					"Please give the id of the committee on which you want to perform action on",
// 				success: false,
// 			};

// 			return res.status(401).json(response);
// 		}

// 		if (!actionOnPendingCommittee) {
// 			const response: StandardResponse = {
// 				message: "Please give the actionOnPendingCommittee",
// 				success: false,
// 			};

// 			return res.status(401).json(response);
// 		}

// 		if (actionOnPendingCommittee === CommitteeStatus.PENDING) {
// 			const response: StandardResponse = {
// 				message: "Cannot make a committee pending",
// 				success: false,
// 			};

// 			return res.status(401).json(response);
// 		}

// 		let user: ITeacher | IAdmin | null;

// 		user =
// 			(await adminModel.findOne({ email: email })) ??
// 			(await teacherModel.findOne({
// 				email: email,
// 				position: TeacherPosition.HOD,
// 			}));

// 		if (!user) {
// 			const response: StandardResponse = {
// 				message: "The user should be HOD or admin",
// 				success: false,
// 			};

// 			return res.status(401).json(response);
// 		}

// 		let pendingCommittees = await checkRequestsForCreatingCommittees(user);

// 		if (pendingCommittees.success && "data" in pendingCommittees) {
// 			//@ts-ignore
// 			const committeeToUpdate = pendingCommittees.data.filter(
// 				(e: ICommittee) => {
// 					return e.committeeId === committeeId;
// 				},
// 			);

// 			const didStatusChange = await committeeModel.updateOne(
// 				{ committeeId },
// 				{ status: actionOnPendingCommittee },
// 			);

// 			if (!didStatusChange.acknowledged) {
// 				const response: StandardResponse = {
// 					message: "Could not change the status of committee",
// 					success: false,
// 				};

// 				return res.status(401).json(response);
// 			}

// 			const response: StandardResponse = {
// 				message: "Changed the status of committee successfully",
// 				success: true,
// 			};

// 			return res.status(201).json(response);
// 		}

// 		const response: StandardResponse = {
// 			message: "There is some problem while getting pending committee",
// 			success: false,
// 		};

// 		return res.status(401).json(response);
// 	} catch (e) {
// 		console.log((e as Error).message);
// 		const response: StandardResponse = {
// 			message:
// 				"There is some problem while performing an action on pending committee" +
// 				(e as Error).message,
// 			success: false,
// 		};

// 		return res.status(401).json(response);
// 	}
// };

// Admin can only update facultyIncharge (of both active and pending committees)
const updateCommitteeByAdmin = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
			newFacultyIncharge: newFacultyInchargeEmail,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
			newFacultyIncharge: string | undefined;
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
				message: "Please give committee id",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!newFacultyInchargeEmail) {
			const response: StandardResponse = {
				message: "Please give faculty incharge email",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			const oldCommittee = await committeeModel
				.findOne({ committeeId }, null, {
					_skipPendingCheckInHook: true,
					_skipDeletingCheckInHook: true,
				})
				.populate<{
					facultyIncharge: ITeacherDocument;
					studentIncharge: IStudentDocument;
				}>(["facultyIncharge", "studentIncharge"])
				.session(session)
				.lean();

			if (!oldCommittee) {
				const response: StandardResponse = {
					message: "Could not find the committee",
					success: false,
				};
				return response;
			}

			const newDataForCommittee = {
				...oldCommittee,
				studentIncharge: oldCommittee.studentIncharge._id,
				facultyIncharge: oldCommittee.facultyIncharge._id,
			};

			const newFacultyIncharge = await teacherModel
				.findOne({
					email: newFacultyInchargeEmail,
				})
				.session(session)
				.lean();

			if (!newFacultyIncharge) {
				const response: StandardResponse = {
					message:
						"Could not find the new faculty incharge while updating",
					success: false,
				};

				return response;
			}
			// If oldFacultyIncharge and newFacultyIncharge are same then don't update
			if (oldCommittee.facultyIncharge.email === newFacultyInchargeEmail) {
				const response: StandardResponse = {
					message:
						"The email of new facultyIncharge should be different from oldFacultyIncharge",
					success: false,
				};

				return response;
			}

			// Change the facultyIncharge in new committee
			newDataForCommittee.facultyIncharge =
				newFacultyIncharge._id as Types.ObjectId;

			// Remove facultyIncharge from faculty team
			newDataForCommittee.facultyTeam =
				newDataForCommittee.facultyTeam?.filter((teacher) => {
					return (
						teacher._id.toString() !==
						(
							oldCommittee.facultyIncharge._id as Types.ObjectId
						).toString()
					);
				});

			let oldFacultyInchargeNewData = oldCommittee.facultyIncharge;

			// Remove facultyIncharge from committeePositions of oldFacultyIncahrge
			oldFacultyInchargeNewData.committeePositions =
				oldFacultyInchargeNewData.committeePositions?.filter(
					(committeePosition) => {
						return (
							committeePosition.committeeObjId?.toString() !==
							oldCommittee._id.toString()
						);
					},
				);

			// Delete the oldFacultyIncharge
			const isOldFacultyInchargeDeleted = await teacherModel
				.deleteOne({ email: oldFacultyInchargeNewData.email })
				.session(session);

			if (!isOldFacultyInchargeDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the faculty incharge while updating",
					success: false,
				};

				return response;
			}

			// Create the oldFacultyIncharge with new data
			const isOldFacultyInchargeWithNewDataCreated = await teacherModel.create(
				[oldFacultyInchargeNewData],
				{ session },
			);

			if (
				!isOldFacultyInchargeWithNewDataCreated ||
				!Array.isArray(isOldFacultyInchargeWithNewDataCreated) ||
				isOldFacultyInchargeWithNewDataCreated.length === 0
			) {
				const response: StandardResponse = {
					message: "Could not create the faculty incharge while updating",
					success: false,
				};

				return response;
			}

			// Add facultyIncharge in committeePositions of newFacultyIncharge
			let newFacultyInchargeNewData = newFacultyIncharge;

			if (
				!newFacultyInchargeNewData.committeePositions ||
				!Array.isArray(newFacultyInchargeNewData.committeePositions)
			) {
				newFacultyInchargeNewData.committeePositions = [];
			}

			newFacultyInchargeNewData.committeePositions =
				newFacultyInchargeNewData.committeePositions?.filter(
					(committeePosition) => {
						return (
							committeePosition.committeeObjId?.toString() !==
							oldCommittee._id.toString()
						);
					},
				);

			newFacultyInchargeNewData.committeePositions.push({
				committeeObjId: oldCommittee._id as Types.ObjectId,
				position: TeacherPosition.FacultyIncharge,
			});

			// Delete the old instance of neFacultyIncharge
			const isNewFacultyInchargeDeleted = await teacherModel
				.deleteOne({ email: newFacultyInchargeEmail })
				.session(session);

			if (!isNewFacultyInchargeDeleted.acknowledged) {
				const response: StandardResponse = {
					message:
						"Could not delete the new faculty incharge while updating",
					success: false,
				};

				return response;
			}

			// Create the newFacultyIncharge with new data
			const isNewFacultyInchargeCreated = await teacherModel.create(
				[newFacultyInchargeNewData],
				{ session },
			);

			if (
				!isNewFacultyInchargeCreated ||
				!Array.isArray(isNewFacultyInchargeCreated) ||
				isNewFacultyInchargeCreated.length === 0
			) {
				const response: StandardResponse = {
					message:
						"Could not create the new faculty incharge while updating",
					success: false,
				};

				return response;
			}

			// Replace facultyIncharge of committee with new facultyIncharge
			newDataForCommittee.facultyIncharge =
				newFacultyInchargeNewData._id as Types.ObjectId;

			// Delete the old committee
			const isOldCommitteeDeleted = await committeeModel
				.deleteOne(
					{
						committeeId,
					},
					{
						_skipPendingCheckInHook: true,
						_skipDeletingCheckInHook: true,
					},
				)
				.session(session);

			if (!isOldCommitteeDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the committee while updating",
					success: false,
				};

				return response;
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

				return response;
			}

			const response: StandardResponse = {
				message: "Committee updated successfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating committee by admin" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

//TODO: Delete pending committee
//TODO: Accept pending committee

export { getAllPendingCommittees, getAllDeletedCommittees, updateCommitteeByAdmin };
