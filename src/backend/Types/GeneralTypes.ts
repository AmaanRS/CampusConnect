// import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IEvent } from "./ModelTypes";

export interface StandardResponse {
	message: string;
	success: boolean;
}

//These both types ensure that password cannot be set on IUserWithoutPassword but that i only during compile time it will take password at run-time

// type EnsureNotField<T, K extends keyof any> = T & { [P in K]?: never };

// type IUserWithoutPassword = EnsureNotField<Omit<IUser, "password">, "password">;

// export interface UpdateRequest extends Request {
// 	body: {
// 		decodedToken: {
// 			email: String;
// 		};
// 		data: IUserWithoutPassword;
// 	};
// }

export interface DataResponse extends StandardResponse {
	data: Object | String;
}

export interface TokenResponse extends StandardResponse {
	token: string;
}

export interface MiddlewareResponse extends StandardResponse {
	decodedToken?: JwtPayload;
}

export interface EventResponse extends StandardResponse {
	events: IEvent[];
}

