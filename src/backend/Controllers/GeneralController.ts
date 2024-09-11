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

const getAllPendingCommittees = async (req: Request, res: Response) => {
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

		let user: ITeacher | IAdmin | null;

		user =
			(await adminModel.findOne({ email: email })) ??
			(await teacherModel.findOne({
				email: email,
				position: TeacherPosition.HOD,
			}));

		if (!user) {
			const response: StandardResponse = {
				message: "The user should be HOD or admin",
				success: false,
			};

			return res.status(401).json(response);
		}

		const pendingCommittees = await checkRequestsForCreatingCommittees(user);

		if (!pendingCommittees.success) {
			const response: StandardResponse = {
				message: "Could not get pendingCommittees",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (pendingCommittees.success && "data" in pendingCommittees) {
			const response: DataResponse = pendingCommittees;

			return res.status(201).json(response);
		}

		const response: StandardResponse = {
			message: "There is some problem while getting pending committee",
			success: false,
		};

		return res.status(401).json(response);
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

const actionOnPendingCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
			actionOnPendingCommittee,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
			actionOnPendingCommittee: CommitteeStatus | undefined;
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
				message:
					"Please give the id of the committee on which you want to perform action on",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!actionOnPendingCommittee) {
			const response: StandardResponse = {
				message: "Please give the actionOnPendingCommittee",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (actionOnPendingCommittee === CommitteeStatus.PENDING) {
			const response: StandardResponse = {
				message: "Cannot make a committee pending",
				success: false,
			};

			return res.status(401).json(response);
		}

		let user: ITeacher | IAdmin | null;

		user =
			(await adminModel.findOne({ email: email })) ??
			(await teacherModel.findOne({
				email: email,
				position: TeacherPosition.HOD,
			}));

		if (!user) {
			const response: StandardResponse = {
				message: "The user should be HOD or admin",
				success: false,
			};

			return res.status(401).json(response);
		}

		let pendingCommittees = await checkRequestsForCreatingCommittees(user);

		if (pendingCommittees.success && "data" in pendingCommittees) {
			//@ts-ignore
			const committeeToUpdate = pendingCommittees.data.filter(
				(e: ICommittee) => {
					return e.committeeId === committeeId;
				},
			);

			const didStatusChange = await committeeModel.updateOne(
				{ committeeId },
				{ status: actionOnPendingCommittee },
			);

			if (!didStatusChange.acknowledged) {
				const response: StandardResponse = {
					message: "Could not change the status of committee",
					success: false,
				};

				return res.status(401).json(response);
			}

			const response: StandardResponse = {
				message: "Changed the status of committee successfully",
				success: true,
			};

			return res.status(201).json(response);
		}

		const response: StandardResponse = {
			message: "There is some problem while getting pending committee",
			success: false,
		};

		return res.status(401).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while performing an action on pending committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export { getAllPendingCommittees, actionOnPendingCommittee };
