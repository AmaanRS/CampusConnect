import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { checkRequestsForCreatingCommittees } from "../Utils/requests";
import { adminModel } from "../Models/Admin";
import { teacherModel } from "../Models/Teacher";
import {
	CommitteeStatus,
	ICommittee,
	ITeacher,
	TeacherPosition,
} from "../Types/ModelTypes";
import { IAdmin } from "../Types/ModelTypes";
import { committeeModel } from "../Models/Committee";

// TODO NOW: Committees will directly be created by admin only so chane the code below to reflect that

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

			return response;
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

//TODO NOW: Update pending committee

// const updatePendingCommittee = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			decodedToken,
// 		}: {
// 			decodedToken: decodedTokenPayload | undefined;
// 		} = req.body;

// 		const result = await getAllPendingCommitteesFunc(decodedToken);

// 		if (!result.success || !("data" in result)) {
// 			const response: StandardResponse = {
// 				message: result.message,
// 				success: false,
// 			};

// 			return res.status(401).json(response);
// 		}
// 	} catch (e) {
// 		console.log((e as Error).message);
// 		const response: StandardResponse = {
// 			message:
// 				"There is some problem while getting pending committee" +
// 				(e as Error).message,
// 			success: false,
// 		};

// 		return res.status(401).json(response);
// 	}
// };

// TODO NOW (Complete this 3): Complete update committee for student and faculty incharge first

//TODO NOW: Delete pending committee
//TODO NOW: Accept pending committee

export { getAllPendingCommittees, getAllDeletedCommittees };
