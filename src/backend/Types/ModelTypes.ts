import { Document, Types } from "mongoose";

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
	Admin = "ADMIN",
	NonTeachingStaff = "NON_TEACHING_STAFF",
	Student = "STUDENT",
	Teacher = "TEACHER",
}

export enum StudentPosition {
	Student = "STUDENT",
	StudentIncharge = "STUDENT_INCHARGE",
	CommitteeMember = "COMMITTEE_MEMBER",
}

export enum TeacherPosition {
	Teacher = "TEACHER",
	HOD = "HOD",
	FacultyIncharge = "FACULTY_INCHARGE",
	FacultyTeam = "FACULTY_TEAM",
}

export enum AdminPosition {
	Admin = "ADMIN",
}

export enum NonTeachingStaffPosition {
	NonTeachingStaff = "NON_TEACHING_STAFF",
}

type UserPosition =
	| TeacherPosition
	| StudentPosition
	| AdminPosition
	| NonTeachingStaffPosition;

export interface IUser {
	email: string;
	password: string;
	department?: Department;
	accType: AccountType;
	position: UserPosition[];
	isProfileComplete: boolean;
}

export interface IUserDocument extends IUser, Document {}

export interface IStudent {
	email: string;
	password: string;
	year: Year;
	department: Department;
	studentId: number;
	accType: AccountType;
	position: StudentPosition[];
	isInChargeOfCommittees?: ICommittee[];
	isMemberOfCommittees?: ICommittee[];
	isProfileComplete: boolean;
}

export interface IStudentDocument extends IStudent, Document {}

export interface ITeacher {
	email: string;
	password: string;
	department: Department;
	accType: AccountType;
	position: TeacherPosition[];
	isInChargeOfCommittees?: ICommittee[];
	isInTeamOfCommittees?: ICommittee[];
	isProfileComplete: boolean;
}

export interface ITeacherDocument extends ITeacher, Document {}

export interface IAdmin {
	email: string;
	password: string;
	accType: AccountType;
	position: AdminPosition[];
	isProfileComplete: boolean;
}

export interface IAdminDocument extends IAdmin, Document {}

export interface INonTeachingStaff {
	email: string;
	password: string;
	department: Department;
	accType: AccountType;
	position: NonTeachingStaffPosition[];
	isProfileComplete: boolean;
}

export interface INonTeachingStaffDocument extends INonTeachingStaff, Document {}

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
