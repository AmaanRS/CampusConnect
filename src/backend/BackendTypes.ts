import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";

export interface StandardResponse {
	message: string;
	success: boolean;
}

//These both types ensure that password cannot be set on IUserWithoutPassword but that i only during compile time it will take password at run-time
type EnsureNotField<T, K extends keyof any> = T & { [P in K]?: never };

type IUserWithoutPassword = EnsureNotField<Omit<IUser, "password">, "password">;

export interface UpdateRequest extends Request {
	body: {
		decodedToken: {
			email: String;
		};
		data: IUserWithoutPassword;
	};
}

export interface DataResponse extends StandardResponse {
	data: Object;
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

export enum Year {
	"1ST" = 1,
	"2ND" = 2,
	"3RD" = 3,
	"4TH" = 4,
}

export enum Department {
	IT = "IT",
	COMS = "COMS",
	AIDS = "AIDS",
}

export enum AccountType {
	Student = "STUDENT",
	Admin = "ADMIN",
	Teacher = "TEACHER",
	NonTeachingStaff = "NON_TEACHING_STAFF",
}

export enum Position {
	Professor = "PROFESSOR",
	AssistantProfessor = "ASSISTANT_PROFESSOR",
	HOD = "HOD",
	LabIncharge = "LAB_INCHARGE",
}

export interface IUser {
	email: string;
	password: string;
	year?: Year;
	division?: string;
	department?: Department;
	studentId?: number;
	accType?: AccountType;
	position?: Position;
	isProfileComplete: boolean;
}

export interface IUserDocument extends IUser, Document {}

export interface ICommittee extends Document {
	name: string;
	head: Types.ObjectId;
	viceHead: Types.ObjectId;
	teacherIncharge: Types.ObjectId;
	description: string;
	members: Types.ObjectId[];
	events?: Types.ObjectId[];
}

export interface IEvent extends Document {
	name: string;
	description: string;
	hostingCommittees: Types.ObjectId[];
	startDate: Date;
	endDate: Date;
	startTime: Date;
	endTime: Date;
}
