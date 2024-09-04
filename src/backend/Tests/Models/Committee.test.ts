import mongoose from "mongoose";
import { committeeModel } from "../../Models/Committee";
import { Department, CommitteeStatus, ICommittee } from "../../Types/ModelTypes";
import { runTestServer, stopTestServer } from "../../Utils/util";

describe("Committee Model Tests", () => {
	beforeAll(async () => {
		await runTestServer();
	});

	const validCommittee: ICommittee = {
		committeeId: "euqhe",
		name: "Tech Club",
		description: "A club for tech enthusiasts",
		studentIncharge: new mongoose.Types.ObjectId(),
		facultyIncharge: new mongoose.Types.ObjectId(),
		committeeOfDepartment: [Department.IT],
		status: CommitteeStatus.PENDING,
	};

	afterAll(async () => {
		await stopTestServer();
	});

	afterEach(async () => {
		await committeeModel.deleteMany({});
	});

	const TestCases = [
		// Valid cases
		{
			name: "valid committee creation",
			committee: {
				...validCommittee,
				status: CommitteeStatus.PENDING,
			},
			shouldThrow: false,
		},
		{
			name: "valid committee with multiple departments",
			committee: {
				...validCommittee,
				committeeOfDepartment: [Department.IT, Department.AIDS],
				status: CommitteeStatus.PENDING,
			},
			shouldThrow: false,
		},
		// Invalid cases
		{
			name: "missing committee name",
			committee: {
				...validCommittee,
				name: undefined,
			},
			shouldThrow: true,
		},
		{
			name: "missing facultyIncharge",
			committee: {
				...validCommittee,
				facultyIncharge: undefined,
			},
			shouldThrow: true,
		},
		{
			name: "invalid status",
			committee: {
				...validCommittee,
				status: "INVALID_STATUS",
			},
			shouldThrow: true,
		},
	];

	it.each(TestCases)("$name", async ({ committee, shouldThrow }) => {
		const createCommittee = async () => {
			const isCommitteeCreated = await committeeModel.create(committee);
			return isCommitteeCreated ? true : false;
		};

		if (shouldThrow) {
			await expect(createCommittee()).rejects.toThrow();
		} else {
			await expect(createCommittee()).resolves.toBeDefined();
		}
	});

	describe("Committee Model Pre-Validate Middleware Tests", () => {
		afterEach(async () => {
			await committeeModel.deleteMany({});
		});

		const validCommitteeBase = {
			name: "Tech Club",
			description: "A club for tech enthusiasts",
			committeeOfDepartment: [Department.IT],
			studentIncharge: new mongoose.Types.ObjectId(),
			facultyIncharge: new mongoose.Types.ObjectId(),
			status: CommitteeStatus.PENDING,
		};

		const mongodbIDForTestingUniqueness = new mongoose.Types.ObjectId();

		const testCases = [
			{
				name: "facultyIncharge added to existing facultyTeam",
				committee: {
					...validCommitteeBase,
					facultyIncharge: new mongoose.Types.ObjectId(),
					facultyTeam: [new mongoose.Types.ObjectId()],
				},
				expectedFacultyTeamLength: 2,
			},
			{
				name: "facultyIncharge creates new facultyTeam array",
				committee: {
					...validCommitteeBase,
					facultyIncharge: new mongoose.Types.ObjectId(),
				},
				expectedFacultyTeamLength: 1,
			},
			{
				name: "studentIncharge added to existing members",
				committee: {
					...validCommitteeBase,
					studentIncharge: new mongoose.Types.ObjectId(),
					members: [new mongoose.Types.ObjectId()],
				},
				expectedMembersLength: 2,
			},
			{
				name: "studentIncharge creates new members array",
				committee: {
					...validCommitteeBase,
					studentIncharge: new mongoose.Types.ObjectId(),
				},
				expectedMembersLength: 1,
			},
			{
				name: "committeeId is generated if not provided",
				committee: {
					...validCommitteeBase,
					studentIncharge: new mongoose.Types.ObjectId(),
					facultyIncharge: new mongoose.Types.ObjectId(),
				},
				shouldGenerateCommitteeId: true,
			},
			{
				name: "unique values in facultyTeam, members, events, and committeeOfDepartment",
				committee: {
					...validCommitteeBase,
					facultyIncharge: new mongoose.Types.ObjectId(),
					facultyTeam: [
						mongodbIDForTestingUniqueness,
						mongodbIDForTestingUniqueness,
					],
					studentIncharge: new mongoose.Types.ObjectId(),
					members: [
						mongodbIDForTestingUniqueness,
						mongodbIDForTestingUniqueness,
					],
					events: [
						mongodbIDForTestingUniqueness,
						mongodbIDForTestingUniqueness,
					],
					committeeOfDepartment: [Department.IT, Department.IT],
				},
				expectedUnique: true,
			},
		];

		it.each(testCases)(
			"$name",
			async ({
				committee,
				expectedFacultyTeamLength,
				expectedMembersLength,
				shouldGenerateCommitteeId,
				expectedUnique,
			}) => {
				const createdCommittee = await committeeModel.create(committee);

				if (expectedFacultyTeamLength !== undefined) {
					expect(createdCommittee.facultyTeam).toHaveLength(
						expectedFacultyTeamLength,
					);
				}

				if (expectedMembersLength !== undefined) {
					expect(createdCommittee.members).toHaveLength(
						expectedMembersLength,
					);
				}

				if (shouldGenerateCommitteeId) {
					expect(createdCommittee.committeeId).toBeDefined();
				}

				if (expectedUnique) {
					expect(new Set(createdCommittee.facultyTeam).size).toBe(
						createdCommittee.facultyTeam?.length,
					);

					expect(new Set(createdCommittee.members).size).toBe(
						createdCommittee.members?.length,
					);

					expect(new Set(createdCommittee.events).size).toBe(
						createdCommittee.events?.length,
					);

					expect(
						new Set(createdCommittee.committeeOfDepartment).size,
					).toBe(createdCommittee.committeeOfDepartment.length);
				}
			},
		);
	});
});
