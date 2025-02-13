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
		// TODO NOW:SSR check
		if (
			isAccountActiveMiddlewarePathsToSkip.some((regex) =>
				regex.test(req.path),
			)
		) {
			return next();
		}

		let userAccountStatus;

		if (req.path === "/user/login") {
			userAccountStatus = await userModel.findOne({
				email: req.body.email,
			});
		} else {
			const response = cookieCheckerFunction(req);

			if (!response.success || !("decodedToken" in response)) {
				return res.status(401).json(response);
			}

			const userDecodedToken = response.decodedToken;

			// Even though if decodedToken with email is sent in the request it will get overrided, but i am keeping this here for extra safety
			if (req.body.decodedToken) {
				delete req.body.decodedToken;
			}

			(req as any).body.decodedToken = userDecodedToken;

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
