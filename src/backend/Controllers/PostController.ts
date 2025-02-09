import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { postModel } from "../Models/Post";
import {
	checkIfFacultyOrStudentInchargeOfCommitteeFunc,
	runWithRetrySession,
} from "../Utils/util";
import { committeeModel } from "../Models/Committee";
import {
	IStudentDocument,
	StudentPosition,
	TeacherPosition,
} from "../Types/ModelTypes";
import { studentModel } from "../Models/Student";

const createPost = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			title,
			content,
			committeeId,
			image,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			title: string | undefined;
			content: string | undefined;
			committeeId: string | undefined;
			image?: [{ imageUrl: string; imagePath: string }];
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
				message: "Give committeeId to post under the committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!title || !content) {
			const response: StandardResponse = {
				message: "Give all of the required fields to create a post",
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

		const committee = await committeeModel
			.findOne({ committeeId })
			.populate(["studentIncharge", "facultyIncharge"])
			.lean();

		if (!committee) {
			const response: StandardResponse = {
				message: "Committee not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const resp = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
			decodedToken,
			oldCommittee: committee,
		});

		if (!resp.success) {
			return res.status(401).json(resp);
		}

		let postedBy;

		if ("data" in resp) {
			if (resp.data === StudentPosition.StudentIncharge) {
				postedBy = committee.studentIncharge._id;
			} else if (resp.data === TeacherPosition.FacultyIncharge) {
				postedBy = committee.facultyIncharge._id;
			}
		}

		const isPostCreated = await postModel.create({
			committeeDocId: committee._id,
			title,
			content,
			image,
			postedBy: postedBy,
		});

		if (!isPostCreated) {
			const response: StandardResponse = {
				message: "Post could not be created",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Post created successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while creating a post" + (e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getPostById = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			postId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			postId: string;
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

		const post = await postModel
			.findOne({ postId })
			.populate({
				path: "committeeDocId",
				populate: [
					{ path: "postedBy", model: "userModel" },
					{ path: "studentIncharge", model: "studentModel" },
					{ path: "facultyIncharge", model: "teacherModel" },
					{ path: "facultyTeam", model: "teacherModel" },
					{ path: "members", model: "userModel" },
					{ path: "events", model: "eventModel" },
				],
			})
			.lean();

		if (!post) {
			const response: StandardResponse = {
				message: "Could not find the post in db",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Fetched the post successfully",
			success: true,
			data: post,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while fetching the post" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const updatePost = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			title,
			content,
			postId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			title?: string;
			content?: string;
			postId: string;
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
				message: "Send post id for updation",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!title && !content) {
			const response: StandardResponse = {
				message: "Send either title or content for updation",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Adding lean is compulsory otherwise it throws error when creating a document with the same data
			const oldPost = await postModel
				.findOne({ postId })
				.session(session)
				.lean();

			if (!oldPost) {
				const response: StandardResponse = {
					message: "Post to update not found",
					success: false,
				};

				return response;
			}

			const isPostDeleted = await postModel
				.deleteOne({ postId })
				.session(session);

			if (!isPostDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Post did'nt get deleted while updating",
					success: false,
				};

				return response;
			}

			if (title) oldPost.title = title;
			if (content) oldPost.content = content;

			const newUpdatedPost = oldPost;

			const isPostUpdated = await postModel.create([newUpdatedPost], {
				session,
			});

			if (!Array.isArray(isPostUpdated) || isPostUpdated.length === 0) {
				const response: StandardResponse = {
					message: "Post update unsuccessfull",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Post updated successfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while updating the post" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const deletePost = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			postId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			postId: string;
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
				message: "Send the post Id",
				success: false,
			};

			return res.status(401).json(response);
		}

		const isPostDeleted = await postModel.deleteOne({ postId });

		if (!isPostDeleted.acknowledged || isPostDeleted.deletedCount === 0) {
			const response: StandardResponse = {
				message: "Could not delete the post",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Post deleted succesfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while deleting the post" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

//TODO: Write with pagination
const getAllPosts = async (req: Request, res: Response) => {
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

		const allPosts = await postModel
			.find()
			.populate([
				{ path: "committeeDocId" },
				{ path: "postedBy", model: "userModel" },
			])
			.lean();

		if (allPosts.length === 0) {
			const response: StandardResponse = {
				message: "There are no posts in db",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Fetched all posts successfully",
			success: true,
			data: allPosts,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while fetching all posts" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// If a student has already liked a post ie student exists in likes array of objects then remove him else add him
const togglePostLike = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			postId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			postId: string | undefined;
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

		const result = await runWithRetrySession(async (session) => {
			const post = await postModel
				.findOne({ postId })
				.populate<{ likes: IStudentDocument[] }>("likes")
				.session(session)
				.lean();

			if (!post) {
				const response: StandardResponse = {
					message: "Post not found",
					success: false,
				};

				return response;
			}

			let likeRemoved: boolean = false;

			if (Array.isArray(post.likes)) {
				for (let i = 0; i < post.likes.length; i++) {
					if (post.likes[i].email === email) {
						const removeLike = await postModel
							.updateOne(
								{ postId },
								{ $pull: { likes: post.likes[i]._id } },
							)
							.session(session)
							.lean();

						if (!removeLike.acknowledged) {
							const response: StandardResponse = {
								message: "Could not update the likes in post",
								success: false,
							};

							return response;
						}

						const isStudentLikesUpdates = await studentModel
							.updateOne(
								{
									email,
								},
								{
									$pull: { postsLiked: post._id },
								},
							)
							.session(session);

						if (!isStudentLikesUpdates.acknowledged) {
							const response: StandardResponse = {
								message: "Could not update the likes in students",
								success: false,
							};

							return response;
						}

						likeRemoved = true;
						break;
					}
				}

				// If like is not removed it should be added
				if (!likeRemoved) {
					const likeAddedInStudent = await studentModel
						.findOneAndUpdate(
							{ email },
							{ $push: { postsLiked: post._id } },
						)
						.session(session)
						.lean();

					if (!likeAddedInStudent) {
						const response: StandardResponse = {
							message: "Could not update the likes in students",
							success: false,
						};

						return response;
					}

					const likeAddedInPost = await postModel
						.updateOne(
							{ postId },
							{ $push: { likes: likeAddedInStudent._id } },
						)
						.session(session)
						.lean();

					if (!likeAddedInPost.acknowledged) {
						const response: StandardResponse = {
							message: "Could not update the likes in post",
							success: false,
						};

						return response;
					}
				}
			} else {
				const response: StandardResponse = {
					message: "There was some problem while liking the post",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Successfully toggled the post like",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while updating like of post" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export {
	createPost,
	getPostById,
	updatePost,
	deletePost,
	getAllPosts,
	togglePostLike,
};
