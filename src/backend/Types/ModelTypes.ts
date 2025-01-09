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

// export const StudentPositionMap: Readonly<{
// 	[key in StudentPosition]: StudentPosition[];
// }> = {
// 	[StudentPosition.Student]: [StudentPosition.Student],
// 	[StudentPosition.CommitteeMember]: [
// 		StudentPosition.Student,
// 		StudentPosition.CommitteeMember,
// 	],
// 	[StudentPosition.StudentIncharge]: [
// 		StudentPosition.Student,
// 		StudentPosition.CommitteeMember,
// 		StudentPosition.StudentIncharge,
// 	],
// } as const;

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

export enum ModelTypes {
	COMMITTEE_MODEL = "committeeModel",
	EVENT_MODEL = "eventModel",
	POST_MODEL = "postModel",
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
	isProfileComplete?: boolean;
	isAccountActive?: boolean;
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
	isInChargeOfCommittees?: ICommittee[] | undefined;
	isMemberOfCommittees?: ICommittee[] | undefined;
	isProfileComplete?: boolean;
	isAccountActive?: boolean;
}

export interface IStudentDocument extends IStudent, Document {}

export interface ITeacher {
	email: string;
	password: string;
	department: Department;
	accType: AccountType;
	position: TeacherPosition[];
	isInChargeOfCommittees?: ICommittee[] | undefined;
	isInTeamOfCommittees?: ICommittee[] | undefined;
	isProfileComplete?: boolean;
	isAccountActive?: boolean;
}

export interface ITeacherDocument extends ITeacher, Document {}

export interface IAdmin {
	email: string;
	password: string;
	accType: AccountType;
	position: AdminPosition[];
	isProfileComplete?: boolean;
	isAccountActive?: boolean;
}

export interface IAdminDocument extends IAdmin, Document {}

export interface INonTeachingStaff {
	email: string;
	password: string;
	department: Department;
	accType: AccountType;
	position: NonTeachingStaffPosition[];
	isProfileComplete?: boolean;
	isAccountActive?: boolean;
}

export interface INonTeachingStaffDocument extends INonTeachingStaff, Document {}

export interface IUniqueIdDocument extends Document {
	uniqueId: string;
}

export enum CommitteeStatus {
	PENDING = "PENDING",
	REJECTED = "REJECTED", // Did'nt use
	ACCEPTED = "ACCEPTED",
	DELETED = "DELETED",
}

export enum College {
	COLLEGE = "COLLEGE",
}

export interface ICommittee {
	committeeId: string;
	name: string;
	description: string;
	studentIncharge: Types.ObjectId;
	facultyIncharge: Types.ObjectId;
	facultyTeam?: Types.ObjectId[] | undefined;
	members?: Types.ObjectId[] | undefined;
	events?: Types.ObjectId[] | undefined;
	status: CommitteeStatus;
	committeeOfDepartment: Department[] | College;
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
// 	isAccountActive?: boolean;
// }"

export interface ICommitteeDocument extends ICommittee, Document {}

export interface IPost {
	postId: string;
	title: string;
	content: string;
}

export interface IPostDocument extends IPost, Document {}

export interface IEvent {
	eventId: string;
	name: string;
	description: string;
	hostingCommittees: Types.ObjectId[];
	startDate: String;
	endDate: String;
	startTime: String;
	endTime: String;
	venue: string;
}

export interface IEventDocument extends IEvent, Document {}
