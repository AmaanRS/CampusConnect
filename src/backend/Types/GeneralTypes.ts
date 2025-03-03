import { JwtPayload } from "jsonwebtoken";
import { AccountType, IEvent } from "./ModelTypes";
import { studentModel } from "../Models/Student";
import { adminModel } from "../Models/Admin";
import { nonTeachingStaffModel } from "../Models/NonTeachingStaff";
import { teacherModel } from "../Models/Teacher";

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
	accountType: AccountType;
	isProfileComplete: boolean;
	isAccountActive: boolean;
}

export const modelMap: Readonly<Record<AccountType, any>> = {
	[AccountType.Student]: studentModel,
	[AccountType.Admin]: adminModel,
	[AccountType.Teacher]: teacherModel,
	[AccountType.NonTeachingStaff]: nonTeachingStaffModel,
} as const;
