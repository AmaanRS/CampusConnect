import { NextFunction, Request, Response } from "express";
import { StandardResponse } from "../Types/GeneralTypes";
import { userModel } from "../Models/User";
import { cookieCheckerFunction } from "./CookieChecker";

// Test this middleware
export const isAccountActive = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const response = cookieCheckerFunction(req);

		if (!response.success || !("decodedToken" in response)) {
			return res.status(401).json(response);
		}

		const userDecodedToken = response.decodedToken;

		console.log(req.path);

		// Paths to skip
		if (req.path === "/signup") {
			next();
		}

		const userAccountStatus = await userModel.findOne({
			email: userDecodedToken.email,
		});

		if (!userAccountStatus) {
			const response: StandardResponse = {
				message: "Could not find user in db",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (!userAccountStatus.isAccountActive) {
			const response: StandardResponse = {
				message: "Your account is not active",
				success: false,
			};

			return res.status(401).json(response);
		}

		next();
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There was some error while checking account activity status" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};
