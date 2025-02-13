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
	AccountType,
	IAdmin,
	IStudentDocument,
	ITeacherDocument,
	IUserDocument,
	StudentPosition,
	TeacherPosition,
} from "../Types/ModelTypes";
import { studentModel } from "../Models/Student";
import { commentModel } from "../Models/Comment";
import { adminModel } from "../Models/Admin";
import { teacherModel } from "../Models/Teacher";

const createPost = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			title,
			content,
			committeeId,
			image,
			links,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			title: string | undefined;
			content: string | undefined;
			committeeId: string | undefined;
			image?: [{ imageUrl: string; imagePath: string }];
			links?: string[];
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

		if (links && (!Array.isArray(links) || links.length === 0)) {
			const response: StandardResponse = {
				message: "links should be given in an array",
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

		const committee = await committeeModel.findOne({ committeeId }).populate<{
			facultyIncharge: ITeacherDocument;
			studentIncharge: IStudentDocument;
		}>(["studentIncharge", "facultyIncharge"]);

		if (!committee) {
			const response: StandardResponse = {
				message: "Committee not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const resp = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
			decodedToken,
			studentInchargeEmail: committee.studentIncharge.email,
			facultyInchargeEmail: committee.facultyIncharge.email,
		});

		if (!resp.success) {
			return res.status(401).json(resp);
		}

		const result = await runWithRetrySession(async (session) => {
			let postedBy;

			if ("data" in resp) {
				if (resp.data === StudentPosition.StudentIncharge) {
					postedBy = committee.studentIncharge._id;
				} else if (resp.data === TeacherPosition.FacultyIncharge) {
					postedBy = committee.facultyIncharge._id;
				}
			}

			const isCommentSectionCreated = await commentModel.create(
				[
					{
						comments: [],
					},
				],
				{ session },
			);

			if (
				!Array.isArray(isCommentSectionCreated) ||
				isCommentSectionCreated.length === 0
			) {
				const response: StandardResponse = {
					message: "Post could not be created",
					success: false,
				};

				return response;
			}

			const isPostCreated = await postModel.create(
				[
					{
						committeeObjId: committee._id,
						title,
						content,
						image,
						postedBy: postedBy,
						commentObjId: isCommentSectionCreated[0]._id,
						relevantLinks: links,
					},
				],
				{ session },
			);

			if (!Array.isArray(isPostCreated) || isPostCreated.length === 0) {
				const response: StandardResponse = {
					message: "Post could not be created",
					success: false,
				};

				return response;
			}

			const isCommentSectionUpdated = await commentModel
				.updateOne(
					{ _id: isCommentSectionCreated[0]._id },
					{
						postObjId: isPostCreated[0]._id,
					},
				)
				.session(session);

			if (!isCommentSectionUpdated.acknowledged) {
				const response: StandardResponse = {
					message: "Could not set the post id in comment model",
					success: false,
				};

				return response;
			}

			// Add post id in committee
			const isPostIdAdded = await committeeModel
				.updateOne(
					{ committeeId },
					{ $push: { posts: isPostCreated[0]._id } },
				)
				.session(session);

			if (!isPostIdAdded.acknowledged) {
				const response: StandardResponse = {
					message: "Could not add the post id in committee model",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Post created successfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
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
			.populate([
				{
					path: "committeeObjId",
					populate: [
						{
							path: "studentIncharge",
							model: "studentModel",
							select: "-password",
						},
						{
							path: "facultyIncharge",
							model: "teacherModel",
							select: "-password",
						},
						{
							path: "facultyTeam",
							model: "teacherModel",
							select: "-password",
						},
						{
							path: "members",
							model: "userModel",
							select: "-password",
						},
						{ path: "events", model: "eventModel" },
						{ path: "posts", model: "postModel" },
					],
				},
				{ path: "postedBy", model: "userModel" },
				{ path: "commentObjId", model: "commentModel" },
				{ path: "likes", model: "userModel" },
			])
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

// Only facultyIncharge or studentIncharge or admin of that committee can update post
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

			if (decodedToken.accountType !== AccountType.Admin) {
				const committee = await committeeModel
					.findOne({ posts: { $in: oldPost._id } })
					.populate<{
						facultyIncharge: ITeacherDocument;
						studentIncharge: IStudentDocument;
					}>(["studentIncharge", "facultyIncharge"])
					.session(session);

				if (!committee) {
					const response: StandardResponse = {
						message: "Committee not found",
						success: false,
					};

					return response;
				}

				const resp = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
					decodedToken,
					studentInchargeEmail: committee.studentIncharge.email,
					facultyInchargeEmail: committee.facultyIncharge.email,
				});

				if (!resp.success) {
					return resp;
				}
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

// Posts are permanently deleted, unlike other delete APIs, because when a committee is set to deleted, isPostDeleted should also be set to true. However, when the deleted committee is made active again, isPostDeleted in all the posts becomes false, which is incorrect. This is because if isPostDeleted in a post was set to true before the committee was deleted, then when the deleted committee is made active again, all the deleted posts will incorrectly become undeleted.
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

		let isPostDeleted;

		const result = await runWithRetrySession(async (session) => {
			const post = await postModel
				.findOne({ postId })
				.populate<{
					committeeObjId: {
						studentIncharge: IStudentDocument;
						facultyIncharge: ITeacherDocument;
					};
				}>({
					path: "committeeObjId",
					populate: [
						{
							path: "studentIncharge",
							model: "studentModel",
							select: "email",
						},
						{
							path: "facultyIncharge",
							model: "teacherModel",
							select: "email",
						},
					],
					select: "studentIncharge facultyIncharge",
				})
				.session(session)
				.lean();

			if (!post) {
				const response: StandardResponse = {
					message: "Post not found",
					success: false,
				};

				return response;
			}

			// Only facultyIncharge or studentIncharge or admin of that committee can delete post
			if (decodedToken.accountType !== AccountType.Admin) {
				const resp = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
					decodedToken,
					studentInchargeEmail: post.committeeObjId.studentIncharge.email,
					facultyInchargeEmail: post.committeeObjId.facultyIncharge.email,
				});

				if (!resp.success) {
					return resp;
				}

				isPostDeleted = await postModel
					.findOneAndDelete({ postId: postId })
					.populate<{ likes: IUserDocument[] }>(["likes"])
					.session(session);
			} else {
				//Admin can literally delete the isPostDeleted:true posts also
				isPostDeleted = await postModel
					.findOneAndDelete(
						{ postId: postId },
						{ _skipDeletedPostsHook: true },
					)
					.populate<{ likes: IUserDocument[] }>(["likes"])
					.session(session);
			}

			if (!isPostDeleted) {
				const response: StandardResponse = {
					message: "Could not delete the post",
					success: false,
				};

				return response;
			}

			//If post is literally deleted its id should also be removed from committee
			const isPostRemovedFromCommittee = await committeeModel
				.updateOne(
					{
						posts: post._id,
					},
					{ $pull: { posts: post._id } },
				)
				.session(session);

			if (!isPostRemovedFromCommittee.acknowledged) {
				const response: StandardResponse = {
					message: "Could remove post from committee posts",
					success: false,
				};

				return response;
			}

			//If post is literally deleted its id should also be removed from admin/teacher/student (Ask SSR whether to keep this code or not, by the way the code works properly)

			const studentIds = isPostDeleted.likes
				.filter((user) => user.accType === AccountType.Student)
				.map((user) => user._id);

			const teacherIds = isPostDeleted.likes
				.filter((user) => user.accType === AccountType.Teacher)
				.map((user) => user._id);

			const adminIds = isPostDeleted.likes
				.filter((user) => user.accType === AccountType.Admin)
				.map((user) => user._id);

			const [studentUpdate, teacherUpdate, adminUpdate] = await Promise.all([
				studentModel
					.updateMany(
						{ _id: { $in: studentIds } },
						{ $pull: { postsLiked: post._id } },
					)
					.session(session),
				teacherModel
					.updateMany(
						{ _id: { $in: teacherIds } },
						{ $pull: { postsLiked: post._id } },
					)
					.session(session),
				adminModel
					.updateMany(
						{ _id: { $in: adminIds } },
						{ $pull: { postsLiked: post._id } },
					)
					.session(session),
			]);

			if (
				!(
					studentUpdate.modifiedCount === studentIds.length &&
					teacherUpdate.modifiedCount === teacherIds.length &&
					adminUpdate.modifiedCount === adminIds.length
				)
			) {
				const response: StandardResponse = {
					message: "Could not remove the post from user's postLiked",
					success: false,
				};

				return response;
			}

			//If post is literally deleted comment section should also be literally deleted
			const isCommentSectionDeleted = await commentModel
				.deleteOne({
					postObjId: isPostDeleted._id,
				})
				.session(session);

			if (!isCommentSectionDeleted) {
				const response: StandardResponse = {
					message:
						"Could not delete the comment section while deleting the post",
					success: false,
				};

				return response;
			}
			// TODO: Remove image from supabase if the post is permanently deleted

			const response: StandardResponse = {
				message: "Post deleted succesfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
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
				{ path: "committeeObjId" },
				{ path: "commentObjId" },
				{ path: "likes" },
				{ path: "postedBy", model: "userModel" },
			])
			.sort({ createdAt: -1 })
			.lean();

		if (allPosts.length === 0) {
			const response: StandardResponse = {
				message: "There are no posts",
				success: true,
			};

			return res.status(201).json(response);
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

// If a user has already liked a post ie user exists in likes array of objects then remove him else add him
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
				.populate<{ likes: IUserDocument[] }>("likes")
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

			let model: any;
			switch (decodedToken.accountType) {
				case AccountType.Student:
					model = studentModel;
					break;

				case AccountType.Admin:
					model = adminModel;
					break;

				case AccountType.Teacher:
					model = teacherModel;
					break;
			}

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

						const isUserLikesUpdate = await model
							.updateOne(
								{
									email,
								},
								{
									$pull: { postsLiked: post._id },
								},
							)
							.session(session);

						if (!isUserLikesUpdate.acknowledged) {
							const response: StandardResponse = {
								message: "Could not update the likes",
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
					const likeAddedInUser = await model
						.findOneAndUpdate(
							{ email },
							{ $push: { postsLiked: post._id } },
						)
						.session(session)
						.lean();

					if (!likeAddedInUser) {
						const response: StandardResponse = {
							message: "Could not update the likes",
							success: false,
						};

						return response;
					}

					const likeAddedInPost = await postModel
						.updateOne(
							{ postId },
							{ $push: { likes: likeAddedInUser._id } },
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

			const response: DataResponse = {
				message: "Successfully toggled the post like",
				success: true,
				data: !likeRemoved,
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
