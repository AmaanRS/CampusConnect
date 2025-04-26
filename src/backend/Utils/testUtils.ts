import { app } from "../app";
import supertest from "supertest";
const request = supertest(app);
import { StandardResponse, TokenResponse } from "../Types/GeneralTypes";
import { Department, Year } from "../Types/ModelTypes";
import { faker } from "@faker-js/faker";
import { committeeModel } from "../Models/Committee";
import { getRandomEnumValue } from "./util";

const getRandomTeacherEmail = () => {
	const firstPart = faker.person.firstName().toLowerCase();
	const secondPart = faker.person.firstName().toLowerCase();

	return `${firstPart}.${secondPart}@vcet.edu.in`;
};

const getRandomHODEmail = () => {
	const firstPart = "hod";
	const secondPart = getRandomEnumValue(Department);

	return `${firstPart}_${secondPart}@vcet.edu.in`;
};

const getRandomStudentEmail = () => {
	const firstPart = faker.person.firstName().toLowerCase();
	const secondPart = faker.number.int({ min: 100000000, max: 999999999 });

	return `${firstPart}.${secondPart}@vcet.edu.in`;
};

const createTestUser = async (
	email: string | undefined,
	password: string | undefined,
): Promise<StandardResponse | TokenResponse> => {
	if (!email || !password) {
		const response: StandardResponse = {
			message: "Send both email and password",
			success: false,
		};

		return response;
	}

	const isUserCreated = await request
		.post("/user/signup")
		.send({ email, password });

	if (!isUserCreated) {
		const response: StandardResponse = {
			message: "Test User was not created",
			success: false,
		};

		return response;
	}

	if (!isUserCreated.body.success) {
		const response: StandardResponse = {
			message: isUserCreated.body.message,
			success: false,
		};

		return response;
	}

	const isUserLoggedIn = await request
		.post("/user/login")
		.send({ email, password });

	if (!isUserLoggedIn) {
		const response: StandardResponse = {
			message: "Test User could not log in",
			success: false,
		};

		return response;
	}

	if (!isUserLoggedIn.body.success) {
		const response: StandardResponse = {
			message: isUserLoggedIn.body.message,
			success: false,
		};

		return response;
	}

	const response: TokenResponse = {
		message: isUserLoggedIn.body.message,
		success: true,
		token: isUserLoggedIn.body.token,
	};

	return response;
};

const createTestAdmin = async (
	givenEmail?: string,
): Promise<StandardResponse | TokenResponse> => {
	const email = givenEmail || getRandomStudentEmail();
	const password = "Aa@123456";

	const res = await createTestUser(email, password);

	if (!res || !res.success) {
		return res;
	}

	const userToken = (res as TokenResponse).token;

	const isAdminCreated = await request
		.post("/admin/createAdmin")
		.set("Authorization", `Bearer ${userToken}`)
		.send();

	if (!isAdminCreated) {
		const response: StandardResponse = {
			message: "Test Admin could not be created",
			success: false,
		};

		return response;
	}

	if (!isAdminCreated.body.success) {
		const response: StandardResponse = {
			message: isAdminCreated.body.message,
			success: false,
		};

		return response;
	}

	const response: TokenResponse = {
		message: isAdminCreated.body.message,
		success: true,
		token: isAdminCreated.body.token,
	};

	return response;
};

const createTestStudent = async (
	department: Department,
	year: Year,
	givenEmail?: string,
): Promise<StandardResponse | TokenResponse> => {
	const email = givenEmail || getRandomStudentEmail();
	const password = "Aa@123456";

	const res = await createTestUser(email, password);

	if (!res || !res.success) {
		return res;
	}

	const userToken = (res as TokenResponse).token;

	const isStudentCreated = await request
		.post("/student/createStudent")
		.set("Authorization", `Bearer ${userToken}`)
		.send({ department, year });

	if (!isStudentCreated) {
		const response: StandardResponse = {
			message: "Test Student could not be created",
			success: false,
		};

		return response;
	}

	if (!isStudentCreated.body.success) {
		const response: StandardResponse = {
			message: isStudentCreated.body.message,
			success: false,
		};

		return response;
	}

	const response: TokenResponse = {
		message: isStudentCreated.body.message,
		success: true,
		token: isStudentCreated.body.token,
	};

	return response;
};

const createTestTeacher = async (
	department?: Department,
	givenEmail?: string,
): Promise<StandardResponse | TokenResponse> => {
	const email = givenEmail || getRandomTeacherEmail();
	const password = "Aa@123456";

	const res = await createTestUser(email, password);

	if (!res || !res.success) {
		return res;
	}

	const userToken = (res as TokenResponse).token;

	const isTeacherCreated = await request
		.post("/teacher/createTeacher")
		.set("Authorization", `Bearer ${userToken}`)
		.send({ department });

	if (!isTeacherCreated) {
		const response: StandardResponse = {
			message: "Test Teacher could not be created",
			success: false,
		};

		return response;
	}

	if (!isTeacherCreated.body.success) {
		const response: StandardResponse = {
			message: isTeacherCreated.body.message,
			success: false,
		};

		return response;
	}

	const response: TokenResponse = {
		message: isTeacherCreated.body.message,
		success: true,
		token: isTeacherCreated.body.token,
	};

	return response;
};

const createTestCommittee = async (
	teacherDepartment: Department,
	committeeOfDepartment: string[],
	committeeId?: string,
): Promise<StandardResponse | TokenResponse> => {
	const name = faker.company.name();
	const description = faker.lorem.lines();

	const teacherEmail = getRandomTeacherEmail();
	const studentEmail = getRandomStudentEmail();

	const isTeacherCreated = await createTestTeacher(
		teacherDepartment,
		teacherEmail,
	);

	if (!isTeacherCreated) {
		const response: StandardResponse = {
			message: "Test Teacher could not be created",
			success: false,
		};

		return response;
	}

	if (!isTeacherCreated.success) {
		const response: StandardResponse = {
			message: isTeacherCreated.message,
			success: false,
		};

		return response;
	}

	const teacherToken = (isTeacherCreated as TokenResponse).token;

	const isStudentCreated = await createTestStudent(
		Department.COMS,
		Year["3RD"],
		studentEmail,
	);

	if (!isStudentCreated) {
		const response: StandardResponse = {
			message: "Test Student could not be created",
			success: false,
		};

		return response;
	}

	if (!isStudentCreated.success) {
		const response: StandardResponse = {
			message: isStudentCreated.message,
			success: false,
		};

		return response;
	}

	const isCommitteeCreated = await request
		.post("/committee/createCommittee")
		.set("Authorization", `Bearer ${teacherToken}`)
		.send({
			name,
			description,
			studentIncharge: studentEmail,
			committeeOfDepartment,
		});

	if (!isCommitteeCreated) {
		const response: StandardResponse = {
			message: "Test Committee could not be created",
			success: false,
		};

		return response;
	}

	if (!isCommitteeCreated.body.success) {
		const response: StandardResponse = {
			message: isCommitteeCreated.body.message,
			success: false,
		};

		return response;
	}

	if (committeeId) {
		const commiteeById = await committeeModel.findOneAndUpdate(
			{ name },
			{ committeeId },
		);

		if (!commiteeById) {
			const response: StandardResponse = {
				message: "Could not set committeeId",
				success: false,
			};

			return response;
		}
	}

	const response: StandardResponse = {
		message: isCommitteeCreated.body.message,
		success: true,
	};

	return response;
};

export {
	createTestUser,
	createTestAdmin,
	createTestStudent,
	createTestTeacher,
	createTestCommittee,
	getRandomHODEmail,
	getRandomTeacherEmail,
	getRandomStudentEmail,
};
