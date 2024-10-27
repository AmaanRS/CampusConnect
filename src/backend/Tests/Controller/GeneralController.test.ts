import { app } from "../../app";
import supertest from "supertest";
const request = supertest(app);
import { adminModel } from "../../Models/Admin";
import { teacherModel } from "../../Models/Teacher";
import { userModel } from "../../Models/User";
import { College, CommitteeStatus, Department } from "../../Types/ModelTypes";
import { runTestServer, stopTestServer } from "../../Utils/util";
import { committeeModel } from "../../Models/Committee";
import {
	createTestAdmin,
	createTestCommittee,
	createTestTeacher,
} from "../../Utils/testUtils";
import { TokenResponse } from "../../Types/GeneralTypes";

describe("General Controller tests", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	afterAll(async () => {
		await stopTestServer();
	});

	describe.skip("POST /getAllPendingCommittees", () => {
		let token: string;

		beforeEach(async () => {
			const HODEmail = "hod_aids@vcet.edu.in";

			const isTeacherCreated = await createTestTeacher(
				Department.AIDS,
				HODEmail,
			);

			if (!isTeacherCreated.success) {
				throw Error(isTeacherCreated.message);
			}

			token = (isTeacherCreated as TokenResponse).token;
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
				expectedStatus: 201,
				expectedResponse: { success: true, data: [] },
				setup: async () => {},
			},
			{
				name: "User is a valid admin, but no pending committees found",
				data: {},
				expectedStatus: 201,
				expectedResponse: { success: true, data: [] },
				setup: async () => {
					const adminEmail = "hod_it@vcet.edu.in";
					const isAdminCreated = await createTestAdmin(adminEmail);

					if (!isAdminCreated.success) {
						throw Error(isAdminCreated.message);
					}

					token = (isAdminCreated as TokenResponse).token;
				},
			},
			{
				name: "User is a valid HOD, and pending committees are found",
				data: {},
				expectedStatus: 201,
				expectedResponse: {
					success: true,
					data: ["Committee1"],
				},
				setup: async () => {
					const committeeOfDepartment = [Department.AIDS];
					const teacherDepartment = Department.AIDS;

					const isCommitteeCreated = await createTestCommittee(
						teacherDepartment,
						committeeOfDepartment,
					);

					if (!isCommitteeCreated.success) {
						throw Error(isCommitteeCreated.message);
					}
				},
			},
			{
				name: "User is a valid admin, and pending committees are found",
				data: {},
				expectedStatus: 201,
				expectedResponse: { success: true, data: ["Committee1"] },
				setup: async () => {
					const committeeOfDepartment = [College.COLLEGE];
					const teacherDepartment = Department.AIDS;

					const isCommitteeCreated = await createTestCommittee(
						teacherDepartment,
						committeeOfDepartment,
					);

					if (!isCommitteeCreated.success) {
						throw Error(isCommitteeCreated.message);
					}

					const adminEmail = "hod_it@vcet.edu.in";
					const isAdminCreated = await createTestAdmin(adminEmail);

					if (!isAdminCreated.success) {
						throw Error(isAdminCreated.message);
					}

					token = (isAdminCreated as TokenResponse).token;
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

	describe.skip("POST /actionOnPendingCommittee", () => {
		let token: string;

		beforeEach(async () => {
			const HODEmail = "hod_aids@vcet.edu.in";

			const isTeacherCreated = await createTestTeacher(
				Department.AIDS,
				HODEmail,
			);

			if (!isTeacherCreated.success) {
				throw Error(isTeacherCreated.message);
			}

			token = (isTeacherCreated as TokenResponse).token;
		});

		afterEach(async () => {
			await userModel.deleteMany({});
			await teacherModel.deleteMany({});
			await adminModel.deleteMany({});
		});

		const testCases = [
			{
				name: "User not authenticated",
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
				name: "CommitteeId not given",
				data: {},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "actionOnPendingCommittee not given",
				data: {
					committeeId: "123r3",
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {},
			},
			{
				name: "User is neither HOD or Admin",
				data: {
					committeeId: "123r3",
					actionOnPendingCommittee: CommitteeStatus.ACCEPTED,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async () => {
					const teacherDepartment = Department.AIDS;

					const isTeacherCreated =
						await createTestTeacher(teacherDepartment);

					if (!isTeacherCreated.success) {
						throw Error(isTeacherCreated.message);
					}

					token = (isTeacherCreated as TokenResponse).token;
				},
			},
			{
				name: "Action cannot be given as pending",
				data: {
					committeeId: "123r3",
					actionOnPendingCommittee: CommitteeStatus.PENDING,
				},
				expectedStatus: 401,
				expectedResponse: { success: false },
				setup: async function (data: { committeeId: string } | undefined) {
					const committeeOfDepartment = [Department.AIDS];
					const teacherDepartment = Department.AIDS;

					const isCommitteeCreated = await createTestCommittee(
						teacherDepartment,
						committeeOfDepartment,
						data?.committeeId,
					);

					if (!isCommitteeCreated.success) {
						throw Error(isCommitteeCreated.message);
					}
				},
			},
			{
				name: "User is Admin and committee status update is successfull",
				data: {
					committeeId: "123r3",
					actionOnPendingCommittee: CommitteeStatus.ACCEPTED,
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				status: CommitteeStatus.ACCEPTED,
				setup: async function (data: { committeeId: string } | undefined) {
					const committeeOfDepartment = [Department.IT];
					const teacherDepartment = Department.AIDS;
					const adminEmail = "hod_it@vcet.edu.in";

					const isCommitteeCreated = await createTestCommittee(
						teacherDepartment,
						committeeOfDepartment,
						data?.committeeId,
					);

					if (!isCommitteeCreated.success) {
						throw Error(isCommitteeCreated.message);
					}

					const isAdminCreated = await createTestAdmin(adminEmail);

					if (!isAdminCreated.success) {
						throw Error(isAdminCreated.message);
					}

					token = (isAdminCreated as TokenResponse).token;
				},
			},
			{
				name: "User is HOD and committee status update is successfull for his own department",
				data: {
					committeeId: "123r3",
					actionOnPendingCommittee: CommitteeStatus.ACCEPTED,
				},
				expectedStatus: 201,
				expectedResponse: { success: true },
				setup: async function (data: { committeeId: string } | undefined) {
					const committeeOfDepartment = [Department.AIDS];
					const teacherDepartment = Department.AIDS;

					const isCommitteeCreated = await createTestCommittee(
						teacherDepartment,
						committeeOfDepartment,
						data?.committeeId,
					);

					if (!isCommitteeCreated.success) {
						throw Error(isCommitteeCreated.message);
					}
				},
			},
		];

		it.each(testCases)(
			"$name",
			async ({ data, expectedStatus, expectedResponse, setup }) => {
				if (setup) {
					if (data && "committeeId" in data && data.committeeId) {
						await setup(data);
					} else {
						await setup(undefined);
					}
				}

				const response = await request
					.post("/actionOnPendingCommittee")
					.set("Authorization", `Bearer ${token}`)
					.send({
						committeeId: data.committeeId,
						actionOnPendingCommittee: data.actionOnPendingCommittee,
					});

				if (expectedResponse.success) {
					const ActualStatus = await committeeModel.findOne(
						{
							committeeId: data.committeeId,
						},
						{ status: 1 },
					);
					expect(ActualStatus?.status).toBe(data.actionOnPendingCommittee);
				}

				expect(response.status).toBe(expectedStatus);
				expect(response.body.success).toBe(expectedResponse.success);
			},
		);
	});
});
