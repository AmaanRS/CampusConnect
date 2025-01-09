import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import {
	AccountType,
	CommitteeStatus,
	Department,
	ICommittee,
	IStudentDocument,
	ITeacherDocument,
	StudentPosition,
	TeacherPosition,
} from "../Types/ModelTypes";
import { runWithRetrySession } from "../Utils/util";
import { studentModel } from "../Models/Student";
import { teacherModel } from "../Models/Teacher";
import { committeeModel } from "../Models/Committee";
import mongoose, { ObjectId } from "mongoose";

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

			// If committee name already exists do not create a new committee
			const doesCommitteeAlreadyExists = await committeeModel.findOne(
				{ name: name },
				{ id: 1 },
			);

			if (doesCommitteeAlreadyExists) {
				const response: StandardResponse = {
					message: "Committee name already exists",
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
			success: true,
			data: committee,
		};

		return res.status(201).json(response);
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

const checkIfFacultyAndStudentInchargeOfCommitteeFunc = ({
	decodedToken,
	oldCommittee,
}: {
	decodedToken: decodedTokenPayload;
	// Used any because the type was too complex
	oldCommittee: any;
}) => {
	try {
		if (decodedToken.accountType === AccountType.Teacher) {
			if (!decodedToken.position.includes(TeacherPosition.FacultyIncharge)) {
				const response: StandardResponse = {
					message: "User should be teacher Incharge to update committee",
					success: false,
				};

				return response;
			}

			//Check if FacultyIncharge is incharge of the committee she is trying to update
			if (oldCommittee.facultyIncharge.email !== decodedToken.email) {
				const response: StandardResponse = {
					message:
						"You must be the faculty incharge of the given committee to update",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "The user is a teacher Incharge",
				success: true,
			};

			return response;
		} else if (decodedToken.accountType === AccountType.Student) {
			if (!decodedToken.position.includes(StudentPosition.StudentIncharge)) {
				const response: StandardResponse = {
					message: "User should be student Incharge to update committee",
					success: false,
				};

				return response;
			}

			//Check if FacultyIncharge is incharge of the committee she is trying to update
			if (oldCommittee.studentIncharge.email !== decodedToken.email) {
				const response: StandardResponse = {
					message:
						"You must be the student incharge of the given committee to update",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "The user is a student Incharge",
				success: true,
			};

			return response;
		} else {
			const response: StandardResponse = {
				message:
					"You must be teacher Incharge or student incharge of the given committee to update",
				success: false,
			};

			return response;
		}
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating committee" +
				(e as Error).message,
			success: false,
		};

		return response;
	}
};

// TODO NOW: Modify updateCommittee such that facultyIncharge or studentIncharge can update some fields of the committee
// TODO NOW: Make update Committee for admin also

// This updateCommittee is for facultyIncharge an studentIncharge
// StudentIncharge can update desc and members
// FacultyIncharge can update desc, members and studentIncharge
const updateCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
			description,
			studentIncharge: studentInchargeEmail,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
			description: string | undefined;
			members: string[] | undefined;
			studentIncharge: string | undefined;
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

		if (!description && !studentInchargeEmail) {
			const response: StandardResponse = {
				message: "Give some data to update committee",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Old committee data
			// If status of committee is deleted then it will not return it (done in model)
			const oldCommittee = await committeeModel
				.findOne({ committeeId })
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
				facultyIncharge: oldCommittee.facultyIncharge._id,
				studentIncharge: oldCommittee.studentIncharge._id,
			};

			if (decodedToken.accountType === AccountType.Teacher) {
				if (
					!decodedToken.position.includes(TeacherPosition.FacultyIncharge)
				) {
					const response: StandardResponse = {
						message:
							"User should be teacher Incharge to update committee",
						success: false,
					};

					return response;
				}

				//Check if FacultyIncharge is incharge of the committee she is trying to update
				if (oldCommittee.facultyIncharge.email !== email) {
					const response: StandardResponse = {
						message:
							"You must be the faculty incharge of the given committee to update",
						success: false,
					};

					return response;
				}

				// Only FacultyIncharge can change studentIncharge
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

						return response;
					}

					if (mongoose.isValidObjectId(newStudentIncharge._id)) {
						newDataForCommittee.studentIncharge =
							newStudentIncharge._id as mongoose.Types.ObjectId;
					} else {
						const response: StandardResponse = {
							message: "Could not set the student while updating",
							success: false,
						};

						return response;
					}
				}
			} else if (decodedToken.accountType === AccountType.Student) {
				if (
					!decodedToken.position.includes(StudentPosition.StudentIncharge)
				) {
					const response: StandardResponse = {
						message:
							"User should be student Incharge to update committee",
						success: false,
					};

					return response;
				}

				//Check if FacultyIncharge is incharge of the committee she is trying to update
				if (oldCommittee.studentIncharge.email !== email) {
					const response: StandardResponse = {
						message:
							"You must be the student incharge of the given committee to update",
						success: false,
					};

					return response;
				}
			} else {
				const response: StandardResponse = {
					message:
						"You must be teacher Incharge or student incharge of the given committee to update",
					success: false,
				};

				return response;
			}

			if (description) {
				newDataForCommittee.description = description;
			}

			// if (facultyInchargeEmail) {
			// 	const facultyIncharge = await teacherModel
			// 		.findOne(
			// 			{
			// 				email: facultyInchargeEmail,
			// 			},
			// 			{ _id: 1 },
			// 		)
			// 		.session(session);

			// 	if (!facultyIncharge) {
			// 		const response: StandardResponse = {
			// 			message: "Could not find the teacher while updating",
			// 			success: false,
			// 		};

			// 		return res.status(401).json(response);
			// 	}

			// 	if (mongoose.isValidObjectId(facultyIncharge._id)) {
			// 		newDataForCommittee.facultyIncharge =
			// 			facultyIncharge._id as mongoose.Types.ObjectId;
			// 	} else {
			// 		const response: StandardResponse = {
			// 			message: "Could not set the teacher while updating",
			// 			success: false,
			// 		};

			// 		return res.status(401).json(response);
			// 	}
			// }

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
				"There is some problem while updating committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// TODO NOW: Add members in committee
// Both faculty incharge and student incharge can add members to the committee
const addMembersInCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			committeeId,
			// Array of emails
			members,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			committeeId: string | undefined;
			members: string[] | undefined;
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

		if (!members || !Array.isArray(members)) {
			const response: StandardResponse = {
				message: "Members should be given inside an array",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (members.length === 0) {
			const response: StandardResponse = {
				message: "Members should be a not empty array",
				success: false,
			};

			return res.status(401).json(response);
		}
		const result = await runWithRetrySession(async (session) => {
			const oldCommittee = await committeeModel
				.findOne({ committeeId })
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

			// Check if member exists in db
			const foundMembers = await studentModel
				.find({
					email: { $in: members },
				})
				.select(["email", "_id"]);

			const foundMembersEmails = foundMembers.map((member) => {
				return member.email.toString();
			});

			const missingMembersEmails = members.filter((member) => {
				!foundMembersEmails.includes(member);
			});

			// If some members are not found
			if (missingMembersEmails.length !== 0) {
				const response: StandardResponse = {
					message: `The following members (students) do not exist: ${missingMembersEmails.join(", ")}`,
					success: false,
				};

				return response;
			}

			const foundMembersIds = foundMembers.map((member) => {
				return member._id as mongoose.Types.ObjectId;
			});

			// Got all the members (duplicates will be removed in the model)
			const allMembers = [...(oldCommittee.members ?? []), ...foundMembersIds];

			// TODO NOW (Complete this 2): After adding members to array add student position field to the students document
			const isStudentPositionChanged = 0;

			const newDataForCommittee = {
				...oldCommittee,
				facultyIncharge: oldCommittee.facultyIncharge._id,
				studentIncharge: oldCommittee.studentIncharge._id,
				members: allMembers,
			};

			// Both faculty incharge and student incharge can add members to the committee therefore there is no need to check whether user position is student or teacher
			const funcResponse = checkIfFacultyAndStudentInchargeOfCommitteeFunc({
				decodedToken,
				oldCommittee,
			});

			if (!funcResponse.success) {
				return funcResponse;
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
				"There is some problem while adding members in committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// TODO NOW: Remove members from committee
// const removeMembersFromCommittee = async (req: Request, res: Response) => {
// 	try {
// 	} catch (e) {
// 		console.log((e as Error).message);
// 		const response: StandardResponse = {
// 			message:
// 				"There is some problem while removing members from committee" +
// 				(e as Error).message,
// 			success: false,
// 		};

// 		return res.status(401).json(response);
// 	}
// };

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

		const isCommitteeDeleted = await committeeModel.findOneAndUpdate(
			{ committeeId: committeeId },
			{ status: CommitteeStatus.DELETED },
		);

		if (!isCommitteeDeleted) {
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
