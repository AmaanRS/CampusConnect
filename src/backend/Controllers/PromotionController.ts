import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { checkIfFacultyOrStudentInchargeOfCommitteeFunc } from "../Utils/util";
import { committeeModel } from "../Models/Committee";
import { promotionModel } from "../Models/Promotion";
import { IStudentDocument, ITeacherDocument } from "../Types/ModelTypes";

const createPromotion = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			image,
			link,
			promotedBy,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			image?: [{ imageUrl: string; imagePath: string }];
			link?: string;
			promotedBy?: string[];
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

		if (!image) {
			const response: StandardResponse = {
				message: "Give image",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (
			image &&
			(!Array.isArray(image) ||
				image.some((img) => !img.imageUrl || !img.imagePath))
		) {
			const response: StandardResponse = {
				message: "Give image in proper structure",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!link) {
			const response: StandardResponse = {
				message: "link should be given",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!promotedBy || !Array.isArray(promotedBy) || promotedBy.length === 0) {
			const response: StandardResponse = {
				message: "Give the committee who is promoting",
				success: false,
			};

			return res.status(401).json(response);
		}

		const committees = await committeeModel
			.find({ committeeId: { $in: promotedBy } })
			.populate<{
				studentIncharge: IStudentDocument;
				facultyIncharge: ITeacherDocument;
			}>(["studentIncharge", "facultyIncharge"])
			.lean();

		if (committees.length !== promotedBy.length) {
			const response: StandardResponse = {
				message: "Some of the given committees do not exists",
				success: false,
			};

			return res.status(401).json(response);
		}

		const resp = committees.some((committee) => {
			return checkIfFacultyOrStudentInchargeOfCommitteeFunc({
				decodedToken,
				studentInchargeEmail: committee.studentIncharge.email,
				facultyInchargeEmail: committee.facultyIncharge.email,
			}).success;
		});

		if (!resp) {
			const response: StandardResponse = {
				message:
					"You should be studentIncharge or facultyIncharge of any one of the given committees to create the promotion",
				success: false,
			};

			return res.status(401).json(response);
		}

		const isPromotionCreated = await promotionModel.create({
			promoImage: image,
			promoLink: link,
			promotedBy,
		});

		if (!isPromotionCreated) {
			const response: StandardResponse = {
				message: "Could not create the promotion",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Promotion created successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while creating promotion" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};
const deletePromotion = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			promoId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			promoId: string | undefined;
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

		if (!promoId) {
			const response: StandardResponse = {
				message: "Send promo id for deletion",
				success: false,
			};

			return res.status(401).json(response);
		}

		const isPromoDeleted = await promotionModel.updateOne(
			{ promoId },
			{ isPromotionDeleted: true },
		);

		if (!isPromoDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the promotion",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Promotion deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while deleting promotion" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getAllPromotions = async (req: Request, res: Response) => {
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

		const allPromotions = await promotionModel
			.find({})
			.populate("promotedBy")
			.lean();

		if (allPromotions.length === 0) {
			const response: DataResponse = {
				message: "No promotions found",
				success: true,
				data: [],
			};

			return res.status(201).json(response);
		}

		const response: DataResponse = {
			message: "All promotions found successfully",
			success: true,
			data: allPromotions,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching all promotions" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export { createPromotion, deletePromotion, getAllPromotions };
