import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { Department, ICommittee } from "../Types/ModelTypes";
import { runWithRetrySession } from "../Utils/util";
import { studentModel } from "../Models/Student";
import { teacherModel } from "../Models/Teacher";
import { committeeModel } from "../Models/Committee";
import mongoose from "mongoose";

const createCommittee = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			name,
			description,
			studentIncharge: studentInchargeEmail,
			committeeOfDepartment,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			name: string | undefined;
			description: string | undefined;
			studentIncharge: string | undefined;
			committeeOfDepartment: Department[] | undefined;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const facultyInchargeEmail = decodedToken.email;

		if (!facultyInchargeEmail) {
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
			success: false,
			data: committee,
		};

		return res.status(401).json(response);
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
			const oldCommittee = await committeeModel
				.findOne({ committeeId })
				.session(session)
				.lean();

			if (!oldCommittee) {
				const response: StandardResponse = {
					message: "Could not find the committee",
					success: false,
				};

				return res.status(401).json(response);
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

				return res.status(401).json(response);
			}

			const newDataForCommittee = oldCommittee;

			if (description) {
				newDataForCommittee.description = description;
			}

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

					return res.status(401).json(response);
				}

				if (mongoose.isValidObjectId(newStudentIncharge._id)) {
					newDataForCommittee.studentIncharge =
						newStudentIncharge._id as mongoose.Types.ObjectId;
				} else {
					const response: StandardResponse = {
						message: "Could not set the student while updating",
						success: false,
					};

					return res.status(401).json(response);
				}
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

				return res.status(401).json(response);
			}

			const response: StandardResponse = {
				message: "Committee updated successfully",
				success: true,
			};

			return res.status(201).json(response);
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

		//
		// While deleting committee make changes to all other models since commitee is referenced in many places
		//
		const isCommitteeDeleted = await committeeModel
			.deleteOne({ committeeId })
			.lean();

		if (!isCommitteeDeleted.acknowledged) {
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

// const getAllEvents = async (res: Response) => {
// 	try {
// 		const events = (await eventModel.find()) as IEvent[];

// 		if (!events) {
// 			const response: StandardResponse = {
// 				message: "There is some problem in logging in",
// 				success: false,
// 			};

// 			return res.json(response);
// 		}

// 		console.log(events);

// 		const response: EventResponse = {
// 			message: "Fetched all events successfully",
// 			success: true,
// 			events: events,
// 		};

// 		return res.json(response);
// 	} catch (error) {
// 		console.log(error);

// 		//Send the message to the frontend that the user is not logged in
// 		const response: StandardResponse = {
// 			message: "There is some problem while fetching events",
// 			success: false,
// 		};

// 		return res.json(response);
// 	}
// };

// const createEvent = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			name,
// 			description,
// 			hostingCommittees,
// 			startDate,
// 			endDate,
// 			startTime,
// 			endTime,
// 		}: {
// 			name: string;
// 			description: string;
// 			hostingCommittees: string[];
// 			startDate: string;
// 			endDate: string;
// 			startTime: string;
// 			endTime: string;
// 		} = req.body;

// 		if (
// 			!name ||
// 			!description ||
// 			!hostingCommittees ||
// 			!startDate ||
// 			!endDate ||
// 			!startTime ||
// 			!endTime
// 		) {
// 			const response: StandardResponse = {
// 				message:
// 					"All fields ie name, description, hostingCommittees, startDate, endDate, startTime, endTime as required",
// 				success: false,
// 			};
// 			return res.json(response);
// 		}

// 		// let hostingCommitteesArray = [];

// 		// for (let i = 0; i < hostingCommittees.length; i++) {
// 		// 	//Convert hostingCommittees string array into objectId array
// 		// 	hostingCommitteesArray.push(createFromHexTo(hostingCommittees[i]));
// 		// }

// 		const event = eventModel.create({
// 			name,
// 			description,
// 			hostingCommittees,
// 			startDate,
// 			endDate,
// 			startTime,
// 			endTime,
// 		});

// 		if (!event) {
// 			const response: StandardResponse = {
// 				message: "There is some problem while creating event",
// 				success: false,
// 			};

// 			return res.json(response);
// 		}

// 		const response: StandardResponse = {
// 			message: "Created event successful",
// 			success: true,
// 		};

// 		return res.json(response);
// 	} catch (error) {
// 		console.log(error);
// 		const response: StandardResponse = {
// 			message: "There is some problem while creating event",
// 			success: false,
// 		};

// 		return res.json(response);
// 	}
// };

// export { getAllEvents, createEvent };

export { createCommittee, getCommittee, updateCommittee, deleteCommittee };
