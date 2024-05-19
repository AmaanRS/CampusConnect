import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export interface StandardResponse {
	message: string;
	success: boolean;
}

export interface TokenResponse extends StandardResponse{
    token?:string
}

export interface MiddlewareResponse extends StandardResponse {
	decodedToken?: JwtPayload;
}

export interface IUser extends Document {
	username: string;
	password: string;
	email: string;
}
