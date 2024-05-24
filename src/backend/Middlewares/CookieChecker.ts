import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { MiddlewareResponse, StandardResponse } from "../BackendTypes";

// Define the cookieChecker function
export const cookieCheckerFunction = (token: string | undefined): StandardResponse|MiddlewareResponse => {
    // If token does not exist, return a response indicating user not authenticated
    if (!token) {
		const response:StandardResponse = {
            message: "User not authenticated",
            success: false,
        }
        return (response)
    }

    try {
        // Check the token with secret key
        const decodedToken: JwtPayload = jwt.verify(
            token,
            process.env.JWT_SECRET!,
        ) as JwtPayload;

        // Return a response indicating user is authenticated along with decoded token
        const response: MiddlewareResponse = {
			message: "The user is authenticated",
			success: true,
			decodedToken: decodedToken,
		};
		return (response)
    } catch (error) {
        // Return a response indicating user not authenticated in case of error
		const response:StandardResponse = {
            message: "User not authenticated",
            success: false,
        }
        return (response)
    }
};

// Define the cookieChecker middleware function
export const cookieCheckerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get token from the request's header
    const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) {
		const response:StandardResponse = {
            message: "User not authenticated",
            success: false,
        }
        return res.json(response)
    }

    // Use the cookieChecker function to handle authentication logic
    const response = cookieCheckerFunction(token);

    // Pass control to the next middleware if user is authenticated
    if (response.success) {
        return next(response);
    }

    // Return the response as JSON if user is not authenticated
    return res.json(response);
};