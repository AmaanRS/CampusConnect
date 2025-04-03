import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import {
	AccountType,
	Department,
	IAdminDocument,
	ICommitteeDocument,
	IStudentDocument,
	ITeacherDocument,
	ModelTypes,
	StudentPosition,
	Tags,
	TeacherPosition,
} from "../Types/ModelTypes";
import { modelMap } from "../Types/GeneralTypes";
import {
	checkIfFacultyOrStudentInchargeOfCommitteeFunc,
	runWithRetrySession,
	updateStudentInchargeOfCommittee,
} from "../Utils/util";
import { studentModel } from "../Models/Student";
import { teacherModel } from "../Models/Teacher";
import { committeeModel } from "../Models/Committee";
import mongoose, { Types } from "mongoose";

const createCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			name,
			description,
			studentIncharge: studentInchargeEmail,
			facultyInchargeEmail,
			committeeOfDepartment,
			tags,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			name: string | undefined;
			description: string | undefined;
			studentIncharge: string | undefined;
			facultyInchargeEmail: string | undefined;
			committeeOfDepartment: Department[] | undefined;
			tags?: Tags[] | [];
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

		if (!tags || !Array.isArray(tags) || tags.length === 0) {
			const response: StandardResponse = {
				message: "Give tags",
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
			const student = await studentModel
				.findOne({ email: studentInchargeEmail })
				.session(session)
				.lean();

			if (!student) {
				const response: StandardResponse = {
					message: "Could not find the student incharge",
					success: false,
				};

				return response;
			}

			// Get the objectId from facultyIncharge
			const teacher = await teacherModel
				.findOne({ email: facultyInchargeEmail })
				.session(session)
				.lean();

			if (!teacher) {
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

			const newCommittee: ICommitteeDocument[] = await committeeModel.create(
				[
					{
						name,
						description,
						studentIncharge: student._id,
						facultyIncharge: teacher._id,
						committeeOfDepartment,
						tags: tags,
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

			// Add position studentIncharge in student
			let newDataForStudent = student;

			if (!newDataForStudent.committeePositions) {
				newDataForStudent.committeePositions = [];
			}

			newDataForStudent.committeePositions.push({
				committeeObjId: newCommittee[0]._id as Types.ObjectId,
				position: StudentPosition.StudentIncharge,
			});

			const isOldStudentDeleted = await studentModel
				.deleteOne({ email: student.email })
				.session(session);

			if (!isOldStudentDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete student while creating committee",
					success: false,
				};

				return response;
			}

			const newStudent = await studentModel.create([newDataForStudent], {
				session,
			});

			if (!Array.isArray(newStudent) || newStudent.length === 0) {
				const response: StandardResponse = {
					message: "Could not create student while creating committee",
					success: false,
				};

				return response;
			}

			// Add position teacher in teacherIncharge
			let newDataForTeacher = teacher;

			if (!newDataForTeacher.committeePositions) {
				newDataForTeacher.committeePositions = [];
			}

			newDataForTeacher.committeePositions.push({
				committeeObjId: newCommittee[0]._id as Types.ObjectId,
				position: TeacherPosition.FacultyIncharge,
			});

			const isOldTeacherDeleted = await teacherModel
				.deleteOne({ email: teacher.email })
				.session(session);

			if (!isOldTeacherDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete student while updating",
					success: false,
				};

				return response;
			}

			const newTeacher = await teacherModel.create([newDataForTeacher], {
				session,
			});

			if (!Array.isArray(newTeacher) || newTeacher.length === 0) {
				const response: StandardResponse = {
					message: "Could not create teacher while creating committee",
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

// TODO: In every api where options to skip hooks in middleware is passes options should also be passed in populate of the fields in which you want deleted records also
const getCommitteeById = async (req: Request, res: Response) => {
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

		const isAdmin = decodedToken.accountType === AccountType.Admin;

		const committee = await committeeModel
			.findOne({ committeeId: committeeId }, null, {
				_skipPendingCheckInHook: isAdmin,
				_skipDeletingCheckInHook: isAdmin,
			})
			.populate([
				{
					path: "studentIncharge",
					select: "-password",
				},
				{
					path: "facultyIncharge",
					select: "-password",
				},
				{
					path: "facultyTeam",
					select: "-password",
				},
				{
					path: "members",
					select: "-password",
				},
				{
					path: "events",
				},
				{
					path: "posts",
					populate: [
						{
							path: "postedBy",
							select: "-password",
						},
						{
							path: "likes",
							select: "-password",
						},
						{
							path: "commentObjId",
						},
					],
				},
				{
					path: "followers",
					populate: [
						{
							path: "userId",
							select: "-password",
						},
					],
				},
			])
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

// This updateCommittee is for facultyIncharge and studentIncharge
// StudentIncharge can update desc
// FacultyIncharge can update desc and studentIncharge
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

			const funcResponse = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
				decodedToken,
				studentInchargeEmail: oldCommittee.studentIncharge.email,
				facultyInchargeEmail: oldCommittee.facultyIncharge.email,
			});

			if (!funcResponse.success) {
				return funcResponse;
			}

			if (funcResponse.success && "data" in funcResponse) {
				if (funcResponse.data === StudentPosition.StudentIncharge) {
					// Nothing here
				} else if (funcResponse.data === TeacherPosition.FacultyIncharge) {
					const response = await updateStudentInchargeOfCommittee({
						studentInchargeEmail,
						committee: oldCommittee,
						session,
						newDataForCommittee:
							newDataForCommittee as ICommitteeDocument,
					});

					if (!response.success) return response;
				} else {
					const response: StandardResponse = {
						message:
							"You must be teacher Incharge or student incharge of the given committee to update",
						success: false,
					};

					return response;
				}
			}

			if (description) {
				newDataForCommittee.description = description;
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
				"There is some problem while updating committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

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
			const isAdmin = decodedToken.accountType === AccountType.Admin;

			const oldCommittee = await committeeModel
				.findOne({ committeeId }, null, {
					_skipPendingCheckInHook: isAdmin,
					_skipDeletingCheckInHook: isAdmin,
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

			// Both faculty incharge and student incharge can add members to the committee
			if (!isAdmin) {
				const funcResponse = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
					decodedToken,
					studentInchargeEmail: oldCommittee.studentIncharge.email,
					facultyInchargeEmail: oldCommittee.facultyIncharge.email,
				});

				if (!funcResponse.success) {
					return funcResponse;
				}
			}

			// Check if members exists in db
			const foundMembers = await studentModel
				.find({
					email: { $in: members },
				})
				.session(session);

			if (!Array.isArray(foundMembers) || foundMembers.length === 0) {
				const response: StandardResponse = {
					message: "Could not find the members",
					success: false,
				};
				return response;
			}

			// Get the emails of members found in db
			const foundMembersEmails = foundMembers.map((member) => {
				return member.email.toString();
			});

			// Get the emails of students which user wanted to add as a member in committee, but they does not exist in db
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

			// Get the objectId of members
			const foundMembersIds = foundMembers.map((member) => {
				return member._id as mongoose.Types.ObjectId;
			});

			// Got all the members (duplicates will be removed in the model)
			const allMembers = [...(oldCommittee.members ?? []), ...foundMembersIds];

			// Make new data for committee
			const newDataForCommittee = {
				...oldCommittee,
				facultyIncharge: oldCommittee.facultyIncharge._id,
				studentIncharge: oldCommittee.studentIncharge._id,
				members: allMembers,
			};

			// Get each member from the members found in db
			for (let i = 0; i < foundMembers.length; i++) {
				const foundMemberData = foundMembers[i].toObject();

				const newDataForFoundMember = foundMemberData;

				// If committeePositions is undefined then create one or if committeePositions is something else and not an array
				// If committeePositions is present but is an empty array
				// If committeePositions is array of empty object then it will throw error in model
				if (
					!newDataForFoundMember.committeePositions ||
					!Array.isArray(newDataForFoundMember.committeePositions) ||
					newDataForFoundMember.committeePositions.length === 0
				) {
					newDataForFoundMember.committeePositions = [];
				}

				newDataForFoundMember.committeePositions.push({
					committeeObjId: newDataForCommittee._id as Types.ObjectId,
					position: StudentPosition.CommitteeMember,
				});

				// Get the object from member which shows its position in the committee
				let committeePositionRecord =
					newDataForFoundMember.committeePositions.find(
						(committeePosition) =>
							committeePosition.committeeObjId?.toString() ===
							newDataForCommittee._id.toString(),
					);

				// The current committeeposition ie the committee which is trying to add the student as member does not exist in committeePositions of student then add it
				if (!committeePositionRecord) {
					committeePositionRecord = {
						committeeObjId: newDataForCommittee._id as Types.ObjectId,
						position: StudentPosition.CommitteeMember,
					};

					newDataForFoundMember.committeePositions.push(
						committeePositionRecord,
					);
				}

				// If the student is a studentIncharge then request to become committee member should be ignored because a studentIncharge is already a committee member
				if (
					committeePositionRecord.position ===
					StudentPosition.StudentIncharge
				) {
					continue;
				}

				// If position is student then make it committee member
				if (committeePositionRecord.position === StudentPosition.Student) {
					committeePositionRecord.position =
						StudentPosition.CommitteeMember;
				}

				// Remove the old committee position record
				newDataForFoundMember.committeePositions =
					newDataForFoundMember.committeePositions.filter(
						(committeePosition) => {
							return (
								committeePosition.committeeObjId?.toString() !==
								newDataForCommittee._id.toString()
							);
						},
					);

				// Add the new committee position record
				newDataForFoundMember.committeePositions.push(
					committeePositionRecord,
				);

				// Delete student and create new student with new data
				const isOldStudentDeleted = await studentModel
					.deleteOne({
						email: newDataForFoundMember.email,
					})
					.session(session);

				if (!isOldStudentDeleted.acknowledged) {
					const response: StandardResponse = {
						message:
							"Student could not be deleted while changing position in committee",
						success: false,
					};

					return response;
				}

				const isStudentCreated = await studentModel.create(
					[newDataForFoundMember],
					{ session },
				);

				if (
					!Array.isArray(isStudentCreated) ||
					isStudentCreated.length === 0
				) {
					const response: StandardResponse = {
						message:
							"Student could not be created while changing position in committee",
						success: false,
					};

					return response;
				}
			}

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
				"There is some problem while adding members in committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Both studentIncharge, teacherIncharge and admin can remove members from the committee
// Cannot remove studentIncharge through this api
const removeMembersFromCommittee = async (req: Request, res: Response) => {
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
			const isAdmin = decodedToken.accountType === AccountType.Admin;

			const oldCommittee = await committeeModel
				.findOne({ committeeId }, null, {
					_skipPendingCheckInHook: isAdmin,
					_skipDeletingCheckInHook: isAdmin,
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

			// Both faculty incharge and student incharge can add members to the committee
			if (!isAdmin) {
				const funcResponse = checkIfFacultyOrStudentInchargeOfCommitteeFunc({
					decodedToken,
					studentInchargeEmail: oldCommittee.studentIncharge.email,
					facultyInchargeEmail: oldCommittee.facultyIncharge.email,
				});

				if (!funcResponse.success) {
					return funcResponse;
				}
			}

			// Check if members exists in db
			let foundMembers = await studentModel
				.find({
					email: { $in: members },
				})
				.session(session);

			if (!Array.isArray(foundMembers) || foundMembers.length === 0) {
				const response: StandardResponse = {
					message: "Could not find the members",
					success: false,
				};
				return response;
			}

			// Get the emails of members found in db
			const foundMembersEmails = foundMembers.map((member) => {
				return member.email.toString();
			});

			// Get the emails of students which user wanted to remove in committee, but they does not exist in db
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

			//Remove email of studentIncahrage if present in members array
			for (let i = 0; i < foundMembers.length; i++) {
				if (
					foundMembers[i].committeePositions?.some((committeePosition) => {
						return (
							committeePosition.committeeObjId?.toString() ===
								(oldCommittee._id as Types.ObjectId).toString() &&
							committeePosition.position ===
								StudentPosition.StudentIncharge
						);
					})
				) {
					// Since the email belongs to studentIncharge and we dont want to remove him from the committee
					foundMembers.splice(i, 1);
				}
			}

			if (!Array.isArray(foundMembers) || foundMembers.length === 0) {
				const response: StandardResponse = {
					message: "Cannot remove the studentIncharge",
					success: false,
				};
				return response;
			}

			// Remove members which are present in foundMembers from OldCommittee.members
			oldCommittee.members = oldCommittee.members?.filter((member) => {
				return !foundMembers.some((found) => {
					return (
						(found._id as Types.ObjectId).toString() ===
						member._id.toString()
					);
				});
			});

			// Got all the members (duplicates will be removed in the model)
			const allMembers = [...(oldCommittee.members ?? [])];

			// Make new data for committee
			const newDataForCommittee = {
				...oldCommittee,
				facultyIncharge: oldCommittee.facultyIncharge._id,
				studentIncharge: oldCommittee.studentIncharge._id,
				members: allMembers,
			};

			// Get each member from the members found in db
			for (let i = 0; i < foundMembers.length; i++) {
				const foundMemberData = foundMembers[i].toObject();

				const newDataForFoundMember = foundMemberData;

				// If committeePositions is undefined then create one or if committeePositions is something else and not an array
				// If committeePositions is present but is an empty array
				// If committeePositions is array of empty object then it will throw error in model
				if (
					!newDataForFoundMember.committeePositions ||
					!Array.isArray(newDataForFoundMember.committeePositions) ||
					newDataForFoundMember.committeePositions.length === 0
				) {
					newDataForFoundMember.committeePositions = [];
				}

				// Remove the old committee position record
				newDataForFoundMember.committeePositions =
					newDataForFoundMember.committeePositions.filter(
						(committeePosition) => {
							return (
								committeePosition.committeeObjId?.toString() !==
								newDataForCommittee._id.toString()
							);
						},
					);

				// Delete student and create new student with new data
				const isOldStudentDeleted = await studentModel
					.deleteOne({
						email: newDataForFoundMember.email,
					})
					.session(session);

				if (!isOldStudentDeleted.acknowledged) {
					const response: StandardResponse = {
						message:
							"Student could not be deleted while changing position in committee",
						success: false,
					};

					return response;
				}

				const isStudentCreated = await studentModel.create(
					[newDataForFoundMember],
					{ session },
				);

				if (
					!Array.isArray(isStudentCreated) ||
					isStudentCreated.length === 0
				) {
					const response: StandardResponse = {
						message:
							"Student could not be created while changing position in committee",
						success: false,
					};

					return response;
				}
			}

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
				"There is some problem while removing members from committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

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

		const isAdmin = decodedToken.accountType === AccountType.Admin;

		const allCommittees = await committeeModel
			.find({}, null, {
				_skipPendingCheckInHook: isAdmin,
				_skipDeletingCheckInHook: isAdmin,
			})
			.populate([
				{
					path: "followers.userId",
					select: "-password",
				},
			])
			.lean();

		if (!allCommittees || allCommittees.length === 0) {
			const response: DataResponse = {
				message: "No committee found",
				success: true,
				data: [],
			};

			return res.status(201).json(response);
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

// If a user is already the follower of a committee ie user exists in follower array of objects then remove him else add him
const toggleFollower = async (req: Request, res: Response) => {
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
				message: "Send committee id",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			const committee = await committeeModel
				.findOne({ committeeId })
				.populate<{
					followers: {
						userId: IStudentDocument | IAdminDocument | ITeacherDocument;
						userType: ModelTypes;
					}[];
				}>("followers.userId")
				.session(session)
				.lean();

			if (!committee) {
				const response: StandardResponse = {
					message: "Committee not found",
					success: false,
				};

				return response;
			}

			let followerRemoved: boolean = false;

			let model = modelMap[decodedToken.accountType];

			if (Array.isArray(committee.followers)) {
				for (let i = 0; i < committee.followers.length; i++) {
					if (committee.followers[i].userId.email === email) {
						const removeFollower = await committeeModel
							.updateOne(
								{ committeeId },
								{
									$pull: {
										followers: {
											userId: committee.followers[i].userId
												._id,
										},
									},
								},
							)
							.session(session)
							.lean();

						if (!removeFollower.acknowledged) {
							const response: StandardResponse = {
								message:
									"Could not update the followers in committee",
								success: false,
							};

							return response;
						}

						const isUserFollowingCommitteesUpdated = await model
							.updateOne(
								{
									email,
								},
								{
									$pull: { followingCommittees: committee._id },
								},
							)
							.session(session);

						if (!isUserFollowingCommitteesUpdated.acknowledged) {
							const response: StandardResponse = {
								message:
									"Could not update following committees in user",
								success: false,
							};

							return response;
						}

						followerRemoved = true;
						break;
					}
				}

				// If follower is not removed it should be added
				if (!followerRemoved) {
					const followingCommitteesAddedInUser = await model
						.findOneAndUpdate(
							{ email },
							{ $push: { followingCommittees: committee._id } },
						)
						.session(session)
						.lean();

					if (!followingCommitteesAddedInUser) {
						const response: StandardResponse = {
							message:
								"Could not update the following committee in user",
							success: false,
						};

						return response;
					}

					const isfollowerAddedInCommittee = await committeeModel
						.updateOne(
							{ committeeId },
							{
								$push: {
									followers: {
										userId: followingCommitteesAddedInUser._id,
										userType: model.modelName,
									},
								},
							},
						)
						.session(session)
						.lean();

					if (!isfollowerAddedInCommittee.acknowledged) {
						const response: StandardResponse = {
							message: "Could not update the follower in committee",
							success: false,
						};

						return response;
					}
				}
			} else {
				const response: StandardResponse = {
					message: "There was some problem while following the committee",
					success: false,
				};

				return response;
			}

			const response: DataResponse = {
				message: "Successfully toggled the follower in committee",
				success: true,
				data: !followerRemoved,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while updating follower of committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const fetchPopularCommittees = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			tags,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			tags?: string[];
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

		if (!tags) {
			const response: StandardResponse = {
				message: "Give tags",
				success: false,
			};

			return res.status(401).json(response);
		}

		const resp = await fetch("http://127.0.0.1:5000/predict_rankings", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = (await resp.json()) as {
			committee_id: string;
			predicted_score: number;
		}[];

		//TEST: Check if this works
		if (!data) {
			const response: StandardResponse = {
				message: "Didnt get data from python",
				success: false,
			};

			return res.status(401).json(response);
		}

		const committeeIdsArray = data.map((obj) => {
			return obj.committee_id;
		});

		const scoreMap = new Map(
			data.map((obj) => [obj.committee_id, obj.predicted_score]),
		);

		const committees = await committeeModel.find({
			committeeId: { $in: committeeIdsArray },
		});

		if (!committees || !Array.isArray(committees) || committees.length === 0) {
			const response: StandardResponse = {
				message: "Could not find committees in db",
				success: false,
			};

			return res.status(401).json(response);
		}

		const sortedCommittees = committees.sort(
			(a, b) =>
				(scoreMap.get(b.committeeId) || 0) -
				(scoreMap.get(a.committeeId) || 0),
		);

		const response: DataResponse = {
			message: "Popular committees",
			success: true,
			data: sortedCommittees,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while updating follower of committee" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export {
	createCommittee,
	getCommitteeById,
	updateCommittee,
	addMembersInCommittee,
	removeMembersFromCommittee,
	getAllCommittees,
	toggleFollower,
	fetchPopularCommittees,
};
