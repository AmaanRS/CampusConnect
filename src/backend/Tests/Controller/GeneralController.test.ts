import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { adminModel } from "../../Models/Admin";
import { teacherModel } from "../../Models/Teacher";
import { userModel } from "../../Models/User";
import { Department, StudentPosition, Year } from "../../Types/ModelTypes";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { studentModel } from "../../Models/Student";
import { committeeModel } from "../../Models/Committee";

const createAdminAndReturnToken = async () => {
	const email = "hod.it@vcet.edu.in";
	const password = "Aa@123456";

	await userModel.create({ email, password });

	const response = await request.post("/user/login").send({ email, password });

	await request
		.post("/admin/createAdmin")
		.set("Authorization", `Bearer ${response.body.token}`)
		.send();

	return response.body.token;
};

const createHOD = async () => {
	const email = "hod.aids@vcet.edu.in";
	const password = "Aa@123456";

	await userModel.create({ email, password });

	const response = await request.post("/user/login").send({ email, password });

	await request
		.post("/teacher/createTeacher")
		.set("Authorization", `Bearer ${response.body.token}`)
		.send({ department: Department.IT });

	return response.body.token;
};

describe("getAllPendingCommittees", () => {
	let token: string;

	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	beforeEach(async () => {
		token = await createHOD();
	});

	afterEach(async () => {
		await userModel.deleteMany({});
		await teacherModel.deleteMany({});
		await adminModel.deleteMany({});
	});

	const testCases = [
		{
			name: "User not found in database (neither HOD nor admin)",
			data: {},
			expectedStatus: 401,
			expectedResponse: { success: false },
			setup: async () => {
				await userModel.deleteMany({});
				await adminModel.deleteMany({});
				await teacherModel.deleteMany({});
			},
		},
		{
			name: "User is a valid HOD, but no pending committees found",
			data: {},
			expectedStatus: 401,
			expectedResponse: { success: true, data: [] },
			setup: async () => {},
		},
		{
			name: "User is a valid admin, but no pending committees found",
			data: {},
			expectedStatus: 401,
			expectedResponse: { success: true, data: [] },
			setup: async () => {
				await createAdminAndReturnToken();
			},
		},
		{
			name: "User is a valid HOD, and pending committees are found",
			data: {},
			expectedStatus: 401,
			expectedResponse: {
				success: true,
				data: ["Committee1"],
			},
			setup: async () => {
				let email = "a.123456789@vcet.edu.in";
				await studentModel.create({
					email,
					password: "AAaa12@43",
					year: Year["1ST"],
					department: Department.AIDS,
					position: StudentPosition.Student,
				});

				await request
					.post("/committee/createCommittee")
					.set("Authorization", `Bearer ${token}`)
					.send({
						name: "fhdv",
						description: "gaeeeeeeve gwer",
						committeeOfDepartment: Department.AIDS,
						studentIncharge: email,
					});
			},
		},
		{
			name: "User is a valid admin, and pending committees are found",
			data: {},
			expectedStatus: 401,
			expectedResponse: { success: true, data: ["Committee1"] },
			setup: async () => {
				await studentModel.deleteMany({});
				await committeeModel.deleteMany({});

				let email = "a.123456789@vcet.edu.in";
				await studentModel.create({
					email,
					password: "AAaa12@43",
					year: Year["1ST"],
					department: Department.AIDS,
					position: StudentPosition.Student,
				});

				await request
					.post("/committee/createCommittee")
					.set("Authorization", `Bearer ${token}`)
					.send({
						name: "fhdv",
						description: "gaeeeeeeve gwer",
						committeeOfDepartment: [Department.AIDS, Department.IT],
						studentIncharge: email,
					});

				await request
					.post("/committee/createCommittee")
					.set("Authorization", `Bearer ${token}`)
					.send({
						name: "fhdvds",
						description: "gaeeeeeeve gwer",
						committeeOfDepartment: Department.AIDS,
						studentIncharge: email,
					});

				token = await createAdminAndReturnToken();
			},
		},
		{
			name: "Database error while fetching user",
			data: {},
			expectedStatus: 401,
			expectedResponse: { success: false },
			setup: async () => {
				await teacherModel.collection.drop();
			},
		},
	];

	it.each(testCases)(
		"$name",
		//@ts-ignore
		async ({ data, expectedStatus, expectedResponse, setup }) => {
			if (setup) await setup();

			const response = await request
				.post("/getAllPendingCommittees")
				.set("Authorization", `Bearer ${token}`)
				.send(data);

			delete response.body.message;

			expect(response.status).toBe(expectedStatus);

			if (response.body.data) {
				expect(response.body.data.length).toEqual(
					expectedResponse.data?.length,
				);
			} else {
				expect(response.body).toEqual(expectedResponse);
			}
		},
	);
});
