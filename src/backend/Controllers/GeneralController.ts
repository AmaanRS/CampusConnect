import { Request, Response } from "express";
import { decodedTokenPayload, StandardResponse } from "../Types/GeneralTypes";
import { checkRequestsForCreatingCommittees } from "../Utils/requests";
import { adminModel } from "../Models/Admin";
import { teacherModel } from "../Models/Teacher";
import { ITeacher } from "../Types/ModelTypes";
import { IAdmin } from "../dist/backend/Types/ModelTypes.d";

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
			(await teacherModel.findOne({ email: email }));

		if (!user) {
			const response: StandardResponse = {
				message: "The user should be HOD or admin",
				success: false,
			};

			return res.status(401).json(response);
		}

		const pendingCommittees = await checkRequestsForCreatingCommittees(
			user.accType,
		);

		if (!pendingCommittees.success) {
			return res.status(401).json(pendingCommittees);
		}

		if (pendingCommittees.success && "data" in pendingCommittees) {
			return res.status(401).json(pendingCommittees);
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

export { getAllPendingCommittees };
