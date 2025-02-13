import { Request } from "express";
import { Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { runWithRetrySession } from "../Utils/util";
import { committeeModel } from "../Models/Committee";
import { eventModel } from "../Models/Event";

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
					name: { $ne: name },
				})
				.session(session)
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

			// Get obect ids corresponding to committee ids
			const hostingCommitteesObjectId = await committeeModel
				.find(
					{ committeeId: { $in: hostingCommitteesId } },
					{ _id: 1 },
					{ session },
				)
				.lean();

			const newEvent = await eventModel.create(
				[
					{
						name,
						description,
						hostingCommittees: hostingCommitteesObjectId,
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

const getEvent = async (req: Request, res: Response) => {
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

		const eventData = await eventModel.findOne({ eventId: eventId });

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
			hostingCommitteesId,
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

		if (!eventId) {
			const response: StandardResponse = {
				message: "Send the eventId",
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
				message: "Send data to update the event",
				success: false,
			};

			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			if (hostingCommitteesId && hostingCommitteesId.length !== 0) {
				//Should not include deleted committtees (done in model)
				const hostingCommitteesExists = await committeeModel
					.find({
						committeeId: { $in: hostingCommitteesId },
					})
					.session(session)
					.lean();

				if (
					!hostingCommitteesExists ||
					hostingCommitteesExists.length === 0
				) {
					const response: StandardResponse = {
						message: "None of the given committee exists",
						success: false,
					};

					return response;
				}

				const foundCommitteeIds = hostingCommitteesExists.map(
					(committee) => committee.committeeId,
				);

				// Identify the missing committee IDs
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
			}

			const newDataForEvent = {
				eventId,
				name,
				description,
				hostingCommitteesId,
				startDate,
				endDate,
				startTime,
				endTime,
				venue,
			};

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

			const updatedEvent = await eventModel.create([newDataForEvent], {
				session,
			});

			if (!updatedEvent) {
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

		const isEventDeleted = await eventModel.deleteOne({ eventId: eventId });

		if (!isEventDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Event could not be deleted",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Event deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
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

		const allEvents = await eventModel.find();

		if (allEvents.length === 0) {
			const response: StandardResponse = {
				message: "There are no events in db",
				success: false,
			};

			return res.status(401).json(response);
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

export { createEvent, getEvent, updateEvent, deleteEvent, getAllEvents };
