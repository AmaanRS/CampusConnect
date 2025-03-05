import { Request, Response } from "express";
import { decodedTokenPayload, StandardResponse } from "../Types/GeneralTypes";
import { commentModel } from "../Models/Comment";
import { postModel } from "../Models/Post";
import {
	AccountType,
	IAdminDocument,
	IStudentDocument,
	ITeacherDocument,
} from "../Types/ModelTypes";
import { studentModel } from "../Models/Student";
import { adminModel } from "../Models/Admin";
import { teacherModel } from "../Models/Teacher";

const createComment = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			postId,
			comment,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			postId: string | undefined;
			comment: string | undefined;
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

		if (!postId) {
			const response: StandardResponse = {
				message: "Send post id",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!comment) {
			const response: StandardResponse = {
				message: "Send the comment to make",
				success: false,
			};

			return res.status(401).json(response);
		}

		const post = await postModel.findOne({ postId }).lean();

		if (!post) {
			const response: StandardResponse = {
				message: "Post not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		let user: IStudentDocument | IAdminDocument | ITeacherDocument | null = null;

		if (decodedToken.accountType === AccountType.Student) {
			user = await studentModel.findOne({ email }).lean();

			if (!user) {
				const response: StandardResponse = {
					message: "User not found",
					success: false,
				};

				return res.status(401).json(response);
			}
		} else if (decodedToken.accountType === AccountType.Admin) {
			user = await adminModel.findOne({ email }).lean();

			if (!user) {
				const response: StandardResponse = {
					message: "User not found",
					success: false,
				};

				return res.status(401).json(response);
			}
		} else if (decodedToken.accountType === AccountType.Teacher) {
			user = await teacherModel.findOne({ email }).lean();
			if (!user) {
				const response: StandardResponse = {
					message: "User not found",
					success: false,
				};

				return res.status(401).json(response);
			}
		} else if (!user) {
			const response: StandardResponse = {
				message: "User not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const isCommentAdded = await commentModel.updateOne(
			{ postObjId: post._id },
			{
				$push: {
					comments: {
						userId: user._id,
						comment,
					},
				},
			},
		);

		if (!isCommentAdded.acknowledged) {
			const response: StandardResponse = {
				message: "Could not add the comment",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Comment added successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while creating a comment" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// const deleteComment = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			decodedToken,
// 		}: {
// 			decodedToken: decodedTokenPayload | undefined;
// 			committeeId: string | undefined;
// 			members: string[] | undefined;
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
// 	} catch (e) {
// 		console.log((e as Error).message);
// 		const response: StandardResponse = {
// 			message:
// 				"There is some problem while creating a comment" +
// 				(e as Error).message,
// 			success: false,
// 		};

// 		return res.status(401).json(response);
// 	}
// };

export {
	createComment,
	//  deleteComment
};
