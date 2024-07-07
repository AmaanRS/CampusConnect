import { Request, Response } from "express";
import { EventResponse, IEvent, StandardResponse } from "../BackendTypes";
import { eventModel } from "../Models/Event";

const getAllEvents = async (res: Response) => {
	try {
		const events = (await eventModel.find()) as IEvent[];

		if (!events) {
			const response: StandardResponse = {
				message: "There is some problem in logging in",
				success: false,
			};

			return res.json(response);
		}

		console.log(events);

		const response: EventResponse = {
			message: "Fetched all events successfully",
			success: true,
			events: events,
		};

		return res.json(response);
	} catch (error) {
		console.log(error);

		//Send the message to the frontend that the user is not logged in
		const response: StandardResponse = {
			message: "There is some problem while fetching events",
			success: false,
		};

		return res.json(response);
	}
};

const createEvent = async (req: Request, res: Response) => {
	try {
		const {
			name,
			description,
			hostingCommittees,
			startDate,
			endDate,
			startTime,
			endTime,
		}: {
			name: string;
			description: string;
			hostingCommittees: string[];
			startDate: string;
			endDate: string;
			startTime: string;
			endTime: string;
		} = req.body;

		if (
			!name ||
			!description ||
			!hostingCommittees ||
			!startDate ||
			!endDate ||
			!startTime ||
			!endTime
		) {
			const response: StandardResponse = {
				message:
					"All fields ie name, description, hostingCommittees, startDate, endDate, startTime, endTime as required",
				success: false,
			};
			return res.json(response);
		}

		// let hostingCommitteesArray = [];

		// for (let i = 0; i < hostingCommittees.length; i++) {
		// 	//Convert hostingCommittees string array into objectId array
		// 	hostingCommitteesArray.push(createFromHexTo(hostingCommittees[i]));
		// }

		const event = eventModel.create({
			name,
			description,
			hostingCommittees,
			startDate,
			endDate,
			startTime,
			endTime,
		});

		if (!event) {
			const response: StandardResponse = {
				message: "There is some problem while creating event",
				success: false,
			};

			return res.json(response);
		}

		const response: StandardResponse = {
			message: "Created event successful",
			success: true,
		};

		return res.json(response);
	} catch (error) {
		console.log(error);
		const response: StandardResponse = {
			message: "There is some problem while creating event",
			success: false,
		};

		return res.json(response);
	}
};

export {
	getAllEvents,
	createEvent
};
