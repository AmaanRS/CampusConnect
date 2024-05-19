import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { MiddlewareResponse } from "../BackendTypes";

export const cookieChecker = (req: Request, res: Response) => {
	//Get token from the request's header
	const token = req.headers.authorization?.split("Bearer ")[1];

	//If token does not exist send the control to the next call and send the message
	if (!token) {
		const response: MiddlewareResponse = {
			message: "User not authenticated",
			success: false,
		};
		return res.json(response);
	}

	try {
		//Check the token with secret key
		const decodedToken: JwtPayload = jwt.verify(
			token,
			process.env.JWT_SECRET!,
		) as JwtPayload;

		const response: MiddlewareResponse = {
			message: "The user is authenticated",
			success: true,
			decodedToken: decodedToken,
		};

		return res.json(response);
	} catch (error) {
		const response: MiddlewareResponse = {
			message: "User not authenticated",
			success: false,
		};

		return res.json(response);
	}
};

module.exports = { cookieChecker };
