import { uniqueIdModel } from "../Models/UniqueId";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";

import { customAlphabet } from "nanoid";
import { ModelTypes } from "../Types/ModelTypes";
import { runWithRetrySession } from "./util";

export const generateUniqueId = async (
	ModelTypes: ModelTypes,
): Promise<StandardResponse | DataResponse> => {
	try {
		const result = await runWithRetrySession(async (session) => {
			const nanoid = customAlphabet("1234567890abcdefghijklmno", 5);
			let uniqueId = nanoid();

			//Prefix added to the generated unique id to show which model the id belongs to
			uniqueId = `${ModelTypes[0].toUpperCase()}${uniqueId}`;

			// Check if the ID already exists before inserting
			const existingId = await uniqueIdModel
				.findOne({
					uniqueId: uniqueId,
				})
				.session(session)
				.lean();

			if (existingId) {
				const response: StandardResponse = {
					message: "Id already exists",
					success: false,
				};

				return response;
			}

			const isCreated = await uniqueIdModel.create(
				[
					{
						uniqueId,
					},
				],
				{
					session,
				},
			);

			if (!Array.isArray(isCreated) || isCreated.length === 0) {
				const response: StandardResponse = {
					message: "Could not add unique id to the db",
					success: false,
				};

				return response;
			}

			const response: DataResponse = {
				message: "Id is unique",
				success: true,
				data: uniqueId,
			};

			return response;
		});

		return result;
	} catch (e) {
		const response: StandardResponse = {
			message: "Could not add unique id to the array " + (e as any).message,
			success: false,
		};

		return response;
	}
};
