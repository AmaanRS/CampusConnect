import { uniqueIdModel } from "../Models/UniqueId";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";

let en = require("nanoid-good/locale/en");
let customAlphabet = require("nanoid-good/async").customAlphabet(en);

export const generateUniqueId = async () => {
	try {
		const nanoid = await customAlphabet("1234567890abcdefghijklmno", 5);
		const uniqueId = nanoid();

		// Check if the ID already exists before inserting
		const existingId = await uniqueIdModel.findOne({
			uniqueIds: { $in: uniqueId },
		});

		if (existingId) {
			const response: StandardResponse = {
				message: "Id already exists",
				success: false,
			};

			return response;
		}

		const isInserted = await uniqueIdModel.findOneAndUpdate(
			{},
			{ $push: { uniqueIds: uniqueId } },
			{ new: true, upsert: true },
		);

		if (!isInserted) {
			const response: StandardResponse = {
				message: "Could not add unique id to the array",
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
	} catch (e) {
		const response: StandardResponse = {
			message: "Could not add unique id to the array " + (e as any).message,
			success: false,
		};

		return response;
	}
};
