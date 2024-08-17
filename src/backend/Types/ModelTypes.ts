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

export type UserPosition =
	| TeacherPosition
	| StudentPosition
	| AdminPosition
	| NonTeachingStaffPosition;

// Mapping between AccountType and UserPosition
type PositionMap = {
	[AccountType.Student]: StudentPosition[];
	[AccountType.Teacher]: TeacherPosition[];
	[AccountType.Admin]: AdminPosition[];
	[AccountType.NonTeachingStaff]: NonTeachingStaffPosition[];
};

export type PositionByAccountType<T extends AccountType> = PositionMap[T];

export interface IUser {
	email: string;
	password: string;
	department?: Department;
	accType: AccountType;
	position: UserPosition[];
	isProfileComplete: boolean;
	isAccountActive: boolean;
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
	// Use nanoid here to store the data
	isInChargeOfCommittees?: ICommittee[] | undefined;
	isMemberOfCommittees?: ICommittee[] | undefined;
	isProfileComplete: boolean;
	isAccountActive: boolean;
}

export interface IStudentDocument extends IStudent, Document {}

export interface ITeacher {
	email: string;
	password: string;
	department: Department;
	accType: AccountType;
	position: TeacherPosition[];
	// Use nanoid here to store the data
	isInChargeOfCommittees?: ICommittee[] | undefined;
	isInTeamOfCommittees?: ICommittee[] | undefined;
	isProfileComplete: boolean;
	isAccountActive: boolean;
}

export interface ITeacherDocument extends ITeacher, Document {}

export interface IAdmin {
	email: string;
	password: string;
	accType: AccountType;
	position: AdminPosition[];
	isProfileComplete: boolean;
	isAccountActive: boolean;
}

export interface IAdminDocument extends IAdmin, Document {}

export interface INonTeachingStaff {
	email: string;
	password: string;
	department: Department;
	accType: AccountType;
	position: NonTeachingStaffPosition[];
	isProfileComplete: boolean;
	isAccountActive: boolean;
}

export interface INonTeachingStaffDocument extends INonTeachingStaff, Document {}

export interface IUniqueIdDocument extends Document {
	uniqueIds: string[];
}

export interface ICommittee {
	committeeId: String;
	name: string;
	description: string;
	studentIncharge: Types.ObjectId;
	facultyIncharge: Types.ObjectId;
	facultyTeam?: Types.ObjectId[] | undefined;
	members?: Types.ObjectId[] | undefined;
	events?: Types.ObjectId[] | undefined;
	isAccountActive: boolean;
	committeeOfDepartment: Department[];
}

//
// I don't know why i did'nt use this
//
// export interface ICommittee {
// 	name: string;
// 	description: string;
// 	studentIncharge: IUser;
// 	facultyIncharge: ITeacher;
// 	facultyTeam?: ITeacher[];
// 	members?: IUser[];
// 	events?: IEvent[];
// 	isAccountActive: boolean;
// }"

export interface ICommitteeDocument extends ICommittee, Document {}

export interface IEvent extends Document {
	name: string;
	description: string;
	hostingCommittees: Types.ObjectId[];
	startDate: Date;
	endDate: Date;
	startTime: Date;
	endTime: Date;
}
