import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {
	decodedTokenPayload,
	JwtDataResponse,
	StandardResponse,
} from "../Types/GeneralTypes";

// Utility function to verify token
export let verifyToken = (req: Request): JwtDataResponse | StandardResponse => {
	const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) {
		return { success: false, message: "User not authenticated" };
	}

	try {
		const decodedToken = jwt.verify(
			token,
			process.env["JWT_SECRET"]!,
		) as decodedTokenPayload;

		return {
			success: true,
			message: "The user is authenticated",
			decodedToken,
		};
	} catch (error) {
		return { success: false, message: "User not authenticated" };
	}
};

// Define the cookieChecker function
export const cookieCheckerFunction = (
	req: Request,
): JwtDataResponse | StandardResponse => {
	const tokenResponse = verifyToken(req);

	const { success, message } = tokenResponse;

	if (!success || !("decodedToken" in tokenResponse)) {
		const response: StandardResponse = {
			message,
			success,
		};

		return response;
	}

	const { decodedToken } = tokenResponse as JwtDataResponse;

	const response: JwtDataResponse = {
		message,
		success,
		decodedToken: decodedToken,
	};

	return response;
};

// Define the cookieChecker middleware function
export const cookieCheckerMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const tokenResponse = verifyToken(req);

	const { success, message } = tokenResponse;

	if (!success) {
		const response: StandardResponse = {
			message,
			success,
		};

		return res.status(401).json(response);
	}

	const { decodedToken } = tokenResponse as JwtDataResponse;

	// Even though if decodedToken with email is sent in the request it will get overrided, but i am keeping this here for extra safety
	if (req.body.decodedToken) {
		delete req.body.decodedToken;
	}

	(req as any).body.decodedToken = decodedToken;

	return next();
};
