import { JwtPayload } from "jsonwebtoken";
import { AccountType, IEvent } from "./ModelTypes";

export interface StandardResponse {
	message: string;
	success: boolean;
}

export interface DataResponse extends StandardResponse {
	data: Object | string;
}

export interface TokenResponse extends StandardResponse {
	token: string;
}

export interface JwtDataResponse extends StandardResponse {
	decodedToken: decodedTokenPayload;
}

export interface EventResponse extends StandardResponse {
	events: IEvent[];
}

export interface decodedTokenPayload extends JwtPayload {
	email: string;
	// DELETE THIS
	// position: UserPosition[];
	accountType: AccountType;
	isProfileComplete: boolean;
	isAccountActive: boolean;
}
