import { Request } from "express";
import { Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { runWithRetrySession } from "../Utils/util";
import { committeeModel } from "../Models/Committee";
import { isValidDate, isValidTime } from "../Utils/dateTime";
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
			const hostingCommitteesExists = await committeeModel
				.find({
					committeeId: { $in: hostingCommitteesId },
				})
				.session(session)
				.lean();

			if (!hostingCommitteesExists || hostingCommitteesExists.length === 0) {
				const response: StandardResponse = {
					message: "None of the given committee exists",
					success: false,
				};

				return res.status(401).json(response);
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

				return res.status(401).json(response);
			}

			// Validate dates
			if (!isValidDate(startDate)) {
				const response: StandardResponse = {
					message: "Invalid start date format expected DD-MM-YYYY",
					success: false,
				};

				return res.status(401).json(response);
			}

			if (!isValidDate(endDate)) {
				const response: StandardResponse = {
					message: "Invalid end date format expected DD-MM-YYYY",
					success: false,
				};

				return res.status(401).json(response);
			}

			// Validate times in 12-hour format
			if (!isValidTime(startTime)) {
				const response: StandardResponse = {
					message: "Invalid start time format (expected hh:mm AM/PM)",
					success: false,
				};

				return res.status(401).json(response);
			}

			if (!isValidTime(endTime)) {
				const response: StandardResponse = {
					message: "Invalid end time format (expected hh:mm AM/PM)",
					success: false,
				};

				return res.status(401).json(response);
			}

			const newEvent = await eventModel.create(
				[
					{
						name,
						description,
						hostingCommitteesId,
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

				return res.status(401).json(response);
			}

			const response: StandardResponse = {
				message: "Event successfully created",
				success: true,
			};

			return res.status(201).json(response);
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
			!name &&
			!description &&
			!hostingCommitteesId &&
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
			if (hostingCommitteesId && hostingCommitteesId.length !== 0) {
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

					return res.status(401).json(response);
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

					return res.status(401).json(response);
				}
			}

			// Validate dates
			if (startDate && !isValidDate(startDate)) {
				const response: StandardResponse = {
					message: "Invalid start date format expected DD-MM-YYYY",
					success: false,
				};

				return res.status(401).json(response);
			}

			if (endDate && !isValidDate(endDate)) {
				const response: StandardResponse = {
					message: "Invalid end date format expected DD-MM-YYYY",
					success: false,
				};

				return res.status(401).json(response);
			}

			// Validate times in 12-hour format
			if (startTime && !isValidTime(startTime)) {
				const response: StandardResponse = {
					message: "Invalid start time format (expected hh:mm AM/PM)",
					success: false,
				};

				return res.status(401).json(response);
			}

			if (endTime && !isValidTime(endTime)) {
				const response: StandardResponse = {
					message: "Invalid end time format (expected hh:mm AM/PM)",
					success: false,
				};

				return res.status(401).json(response);
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

				return res.status(401).json(response);
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

				return res.status(401).json(response);
			}

			const updatedEvent = await eventModel.create([newDataForEvent], {
				session,
			});

			if (!updatedEvent) {
				const response: StandardResponse = {
					message: "Could not create the event while updating",
					success: false,
				};

				return res.status(401).json(response);
			}

			const response: StandardResponse = {
				message: "Updated event successfully",
				success: true,
			};

			return res.status(201).json(response);
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

export { createEvent, getEvent, updateEvent, deleteEvent };
