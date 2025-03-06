import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import {
	checkIfFacultyOrStudentInchargeOfCommitteeFunc,
	runWithRetrySession,
} from "../Utils/util";
import { committeeModel } from "../Models/Committee";
import { eventModel } from "../Models/Event";
import {
	ITeacherDocument,
	IStudentDocument,
	AccountType,
} from "../Types/ModelTypes";

const createEvent = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			name,
			description,
			hostingCommitteesId,
			startDate,
			endDate,
			startTime,
			endTime,
			venue,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			name: string | undefined;
			description: string | undefined;
			hostingCommitteesId: string[] | undefined;
			startDate: string | undefined;
			endDate: string | undefined;
			startTime: string | undefined;
			endTime: string | undefined;
			venue: string | undefined;
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

		if (
			!name ||
			!description ||
			!hostingCommitteesId ||
			!startDate ||
			!endDate ||
			!startTime ||
			!endTime ||
			!venue
		) {
			const response: StandardResponse = {
				message:
					"Give name,description,hostingCommittees,startDate,endDate,startTime,endTime,venue for creating an event",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Get the hosting committees
			// Should not include deleted committtees (done in model)
			// Event should not have same name with any existing event
			const hostingCommitteesExists = await committeeModel
				.find({
					committeeId: { $in: hostingCommitteesId },
				})
				.session(session)
				.populate<{
					facultyIncharge: ITeacherDocument;
					studentIncharge: IStudentDocument;
				}>(["studentIncharge", "facultyIncharge"])
				.lean();

			if (!hostingCommitteesExists || hostingCommitteesExists.length === 0) {
				const response: StandardResponse = {
					message: "None of the given committee exists",
					success: false,
				};

				return response;
			}

			const foundCommitteeIds = hostingCommitteesExists.map(
				(committee) => committee.committeeId,
			);

			const foundCommitteeObjIds = hostingCommitteesExists.map(
				(committee) => committee._id,
			);

			// Identify the missing committee IDs (ie committee ids which are not present in db or are marked as deleted)
			const missingCommitteeIds = hostingCommitteesId.filter(
				(id) => !foundCommitteeIds.includes(id),
			);

			if (missingCommitteeIds.length > 0) {
				const response: StandardResponse = {
					message: `The following committees do not exist: ${missingCommitteeIds.join(", ")}`,
					success: false,
				};

				return response;
			}

			const isStudOrTeachIncharge = hostingCommitteesExists.some(
				(committee) => {
					return checkIfFacultyOrStudentInchargeOfCommitteeFunc({
						decodedToken,
						studentInchargeEmail: committee.studentIncharge.email,
						facultyInchargeEmail: committee.facultyIncharge.email,
					}).success;
				},
			);

			if (!isStudOrTeachIncharge) {
				const response: StandardResponse = {
					message:
						"You should be studentIncharge or facultyIncharge of one of the committee under whom you are trying to create an event",
					success: false,
				};

				return response;
			}

			// Get object ids corresponding to committee ids
			// const hostingCommitteesObjectId = await committeeModel
			// 	.find(
			// 		{ committeeId: { $in: hostingCommitteesId } },
			// 		{ _id: 1 },
			// 		{ session },
			// 	)
			// 	.lean();

			const newEvent = await eventModel.create(
				[
					{
						name,
						description,
						hostingCommittees: foundCommitteeObjIds,
						startDate,
						endDate,
						startTime,
						endTime,
						venue,
					},
				],
				{ session },
			);

			if (!newEvent || newEvent.length === 0) {
				const response: StandardResponse = {
					message: "Could not create new event",
					success: false,
				};

				return response;
			}

			// Add event in committees
			const isEventAddedInCommittee = await committeeModel.updateMany(
				{
					committeeId: { $in: foundCommitteeIds },
				},
				{
					$addToSet: { events: newEvent[0]._id },
				},
				{ session },
			);

			if (!isEventAddedInCommittee) {
				const response: StandardResponse = {
					message: "Could not add event to the committee",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Event successfully created",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while creating event" + (e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getEventById = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			eventId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			eventId: string | undefined;
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

		if (!eventId) {
			const response: StandardResponse = {
				message: "Send eventId",
				success: false,
			};

			return res.status(401).json(response);
		}

		const eventData = await eventModel.findOne({ eventId: eventId }).populate([
			{
				path: "hostingCommittees",
			},
		]);

		if (!eventData) {
			const response: StandardResponse = {
				message: "Event not found",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "User is not authenticated",
			success: true,
			data: eventData,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching event" + (e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const updateEvent = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			eventId,
			name,
			description,
			startDate,
			endDate,
			startTime,
			endTime,
			venue,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			eventId: string | undefined;
			name: string | undefined;
			description: string | undefined;
			startDate: string | undefined;
			endDate: string | undefined;
			startTime: string | undefined;
			endTime: string | undefined;
			venue: string | undefined;
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

		if (!eventId) {
			const response: StandardResponse = {
				message: "Send the eventId",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (
			!name &&
			!description &&
			!startDate &&
			!endDate &&
			!startTime &&
			!endTime &&
			!venue
		) {
			const response: StandardResponse = {
				message: "Send data to update the event",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// if (hostingCommitteesId && hostingCommitteesId.length !== 0) {
			// 	//Should not include deleted committtees (done in model)
			// 	const hostingCommitteesExists = await committeeModel
			// 		.find({
			// 			committeeId: { $in: hostingCommitteesId },
			// 		})
			// 		.session(session)
			// 		.lean();

			// 	if (
			// 		!hostingCommitteesExists ||
			// 		hostingCommitteesExists.length === 0
			// 	) {
			// 		const response: StandardResponse = {
			// 			message: "None of the given committee exists",
			// 			success: false,
			// 		};

			// 		return response;
			// 	}

			// 	const foundCommitteeIds = hostingCommitteesExists.map(
			// 		(committee) => committee.committeeId,
			// 	);

			// 	// Identify the missing committee IDs
			// 	const missingCommitteeIds = hostingCommitteesId.filter(
			// 		(id) => !foundCommitteeIds.includes(id),
			// 	);

			// 	if (missingCommitteeIds.length > 0) {
			// 		const response: StandardResponse = {
			// 			message: `The following committees do not exist: ${missingCommitteeIds.join(", ")}`,
			// 			success: false,
			// 		};

			// 		return response;
			// 	}
			// }

			// Get the old event
			const oldEvent = await eventModel
				.findOne({ eventId })
				.session(session)
				.lean();

			if (!oldEvent) {
				const response: StandardResponse = {
					message: "Could not find the event",
					success: false,
				};

				return response;
			}

			//Get the committee whose event user is trying to update
			const committees = await committeeModel
				.find({
					_id: { $in: oldEvent.hostingCommittees },
				})
				.populate<{
					facultyIncharge: ITeacherDocument;
					studentIncharge: IStudentDocument;
				}>(["studentIncharge", "facultyIncharge"])
				.session(session);

			if (
				!committees.some((committee) => {
					return checkIfFacultyOrStudentInchargeOfCommitteeFunc({
						decodedToken,
						studentInchargeEmail: committee.studentIncharge.email,
						facultyInchargeEmail: committee.facultyIncharge.email,
					}).success;
				})
			) {
				const response: StandardResponse = {
					message:
						"You should be studentIncharge or facultyIncharge of one of the committee under whom you are trying to update an event",
					success: false,
				};

				return response;
			}

			// Delete the old event
			const isEventDeleted = await eventModel
				.deleteOne({ eventId })
				.session(session)
				.lean();

			if (!isEventDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the event while updating",
					success: false,
				};

				return response;
			}

			let newDataForEvent = { ...oldEvent };

			if (name) newDataForEvent.name = name;
			if (description) newDataForEvent.description = description;
			if (startDate) newDataForEvent.startDate = startDate;
			if (endDate) newDataForEvent.endDate = endDate;
			if (startTime) newDataForEvent.startTime = startTime;
			if (endTime) newDataForEvent.endTime = endTime;
			if (venue) newDataForEvent.venue = venue;

			const updatedEvent = await eventModel.create([newDataForEvent], {
				session,
			});

			if (
				!updatedEvent ||
				!Array.isArray(updatedEvent) ||
				updateEvent.length === 0
			) {
				const response: StandardResponse = {
					message: "Could not create the event while updating",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Updated event successfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating event" + (e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Events are permanently deleted, unlike other delete APIs, because when a committee is set to deleted, isEventDeleted should also be set to true. However, when the deleted committee is made active again, isEventDeleted in all the events becomes false, which is incorrect. This is because if isEventDeleted in a event was set to true before the committee was deleted, then when the deleted committee is made active again, all the deleted events will incorrectly become undeleted.
const deleteEvent = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			eventId,
		}: {
			decodedToken: decodedTokenPayload | undefined;
			eventId: string | undefined;
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

		if (!eventId) {
			const response: StandardResponse = {
				message: "Send id of the event to be deleted",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			const isAdmin = decodedToken.accountType === AccountType.Admin;

			const event = await eventModel
				.findOne({ eventId }, null, { _skipDeletedEventsHook: isAdmin })
				.session(session)
				.lean();

			if (!event) {
				const response: StandardResponse = {
					message: "Event not found",
					success: false,
				};

				return response;
			}

			if (!isAdmin) {
				const committees = await committeeModel
					.find({
						events: { $in: event._id },
					})
					.populate<{
						facultyIncharge: ITeacherDocument;
						studentIncharge: IStudentDocument;
					}>(["studentIncharge", "facultyIncharge"])
					.session(session)
					.lean();

				if (
					!committees.some((committee) => {
						return checkIfFacultyOrStudentInchargeOfCommitteeFunc({
							decodedToken,
							studentInchargeEmail: committee.studentIncharge.email,
							facultyInchargeEmail: committee.facultyIncharge.email,
						}).success;
					})
				) {
					const response: StandardResponse = {
						message:
							"You should be studentIncharge or facultyIncharge of one of the committee under whom you are trying to detele the event",
						success: false,
					};

					return response;
				}
			}

			//Delete eventid from committee
			const isEventRemovedFromCommittee = await committeeModel.updateMany(
				{
					events: { $in: event._id },
				},
				{
					$pull: { events: event._id },
				},
				{ session },
			);

			if (!isEventRemovedFromCommittee.acknowledged) {
				const response: StandardResponse = {
					message: "Event could not be removed from committee",
					success: false,
				};

				return response;
			}

			const isEventDeleted = await eventModel
				.deleteOne({ eventId: eventId }, { _skipDeletedEventsHook: isAdmin })
				.session(session);

			if (!isEventDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Event could not be deleted",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Event deleted successfully",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while deleting event" + (e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

const getAllEvents = async (req: Request, res: Response) => {
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

		const allEvents = await eventModel.find(
			{},
			{ _skipDeletedEventsHook: isAdmin },
		);

		if (allEvents.length === 0) {
			const response: DataResponse = {
				message: "There are no events in db",
				success: true,
				data: [],
			};

			return res.status(201).json(response);
		}

		const response: DataResponse = {
			message: "Fetched all events successfully",
			success: true,
			data: allEvents,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while fetching all events" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

//TODO: Create api for adding and removing hosting committees in one function

export { createEvent, getEventById, updateEvent, deleteEvent, getAllEvents };
