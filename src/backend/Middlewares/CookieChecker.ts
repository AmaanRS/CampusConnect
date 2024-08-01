// import jwt, { JwtPayload } from "jsonwebtoken";
// import { NextFunction, Request, Response } from "express";
// import { MiddlewareResponse, StandardResponse } from "../BackendTypes";

// // Define the cookieChecker function
// export const cookieCheckerFunction = (req: Request, res: Response) => {
// 	// Get token from the request's header
// 	const token = req.headers.authorization?.split("Bearer ")[1];

// 	// If token does not exist, return a response indicating user not authenticated
// 	if (!token) {
// 		const response: StandardResponse = {
// 			message: "User not authenticated",
// 			success: false,
// 		};

// 		return res.json(response);
// 	}

// 	try {
// 		// Check the token with secret key
// 		const decodedToken: JwtPayload = jwt.verify(
// 			token,
// 			process.env.JWT_SECRET!,
// 		) as JwtPayload;

// 		// Return a response indicating user is authenticated along with decoded token
// 		const response: MiddlewareResponse = {
// 			message: "The user is authenticated",
// 			success: true,
// 			decodedToken: decodedToken.email,
// 		};

// 		return res.json(response);
// 	} catch (error) {
// 		// Return a response indicating user not authenticated in case of error
// 		const response: StandardResponse = {
// 			message: "User not authenticated",
// 			success: false,
// 		};

// 		return res.json(response);
// 	}
// };

// // Define the cookieChecker middleware function
// export const cookieCheckerMiddleware = (req: Request, next: NextFunction) => {
// 	// Get token from the request's header
// 	const token = req.headers.authorization?.split("Bearer ")[1];

// 	// If token does not exist, return a response indicating user not authenticated
// 	if (!token) {
// 		const response: StandardResponse = {
// 			message: "User not authenticated",
// 			success: false,
// 		};

// 		return next(response);
// 	}

// 	try {
// 		// Check the token with secret key
// 		const decodedToken: JwtPayload = jwt.verify(
// 			token,
// 			process.env.JWT_SECRET!,
// 		) as JwtPayload;

// 		// Return a response indicating user is authenticated along with decoded token
// 		const response: MiddlewareResponse = {
// 			message: "The user is authenticated",
// 			success: true,
// 			decodedToken: decodedToken.email,
// 		};

// 		return next(response);
// 	} catch (error) {
// 		// Return a response indicating user not authenticated in case of error
// 		const response: StandardResponse = {
// 			message: "User not authenticated",
// 			success: false,
// 		};
// 		return next(response);
// 	}
// };

//Chatgpt version

import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { MiddlewareResponse, StandardResponse } from "../Types/GeneralTypes";

// Utility function to verify token
const verifyToken = (req: Request): MiddlewareResponse => {
	const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) {
		return { success: false, message: "User not authenticated" };
	}

	try {
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET!,
		) as JwtPayload;

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
export const cookieCheckerFunction = (req: Request, res: Response) => {
	const { success, message, decodedToken } = verifyToken(req);

	if (success) {
		const response: MiddlewareResponse = {
			message,
			success,
			decodedToken: decodedToken!.email,
		};

		return res.json(response);
	} else {
		const response: StandardResponse = {
			message,
			success,
		};

		return res.json(response);
	}
};

//Write tests for middlewares//

// Define the cookieChecker middleware function
export const cookieCheckerMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { success, message, decodedToken } = verifyToken(req);

	if (success) {
		(req as any).body.decodedToken = decodedToken;

		return next();
	} else {
		return res.status(401).json({ message, success });
	}
};
