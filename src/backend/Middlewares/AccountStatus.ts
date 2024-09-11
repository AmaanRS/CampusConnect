import { NextFunction, Request, Response } from "express";
import { StandardResponse } from "../Types/GeneralTypes";
import { userModel } from "../Models/User";
import { cookieCheckerFunction } from "./CookieChecker";
import { isAccountActiveMiddlewarePathsToSkip } from "../Utils/paths";

export const isAccountActive = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Paths to skip
		if (isAccountActiveMiddlewarePathsToSkip.includes(req.path)) {
			return next();
		}

		let userAccountStatus;

		if (req.path === "/user/login") {
			userAccountStatus = await userModel.findOne({
				email: req.body.email,
			});
		} else {
			// TODO: Add the decodedToken to the req here and stop using cookieCheckerMiddleware as this function first authenticate user then check if its account is active or not
			const response = cookieCheckerFunction(req);

			if (!response.success || !("decodedToken" in response)) {
				return res.status(401).json(response);
			}

			const userDecodedToken = response.decodedToken;

			userAccountStatus = await userModel.findOne({
				email: userDecodedToken.email,
			});
		}

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

// TODO: isProfileComplete maybe merge in isAccountActive
