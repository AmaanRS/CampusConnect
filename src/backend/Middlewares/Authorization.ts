import { NextFunction, Request, Response } from "express";
import { cookieCheckerFunction } from "./CookieChecker";
import { AccountType, PositionByAccountType } from "../Types/ModelTypes";
import { decodedTokenPayload, StandardResponse } from "../Types/GeneralTypes";
import _ from "lodash";

// TODO: Use authorizationMiddlewareFactory as a global middleware
const authorizationMiddlewareFactory = (
	requiredPosition: PositionByAccountType<AccountType>,
	requiredAccType: AccountType,
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let decodedToken: decodedTokenPayload | undefined;

			// User's data which should be admin
			const response = cookieCheckerFunction(req);

			if (!response.success || !("decodedToken" in response)) {
				return res.status(401).json(response);
			}

			decodedToken = response.decodedToken;

			if (
				requiredAccType === decodedToken.accountType &&
				_.isEqual(requiredPosition, decodedToken.position)
			) {
				return next();
			} else {
				const response: StandardResponse = {
					message: "User is unauthorized to do this action",
					success: false,
				};

				return res.status(401).json(response);
			}
		} catch (e) {
			console.log((e as Error).message);
			const response: StandardResponse = {
				message:
					"Could not perform the authorization for the given action" +
					(e as Error).message,
				success: false,
			};

			return res.status(401).json(response);
		}
	};
};

export { authorizationMiddlewareFactory };
