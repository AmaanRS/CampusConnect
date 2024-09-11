import { committeeModel } from "../Models/Committee";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";
import {
	AccountType,
	College,
	CommitteeStatus,
	IAdmin,
	ICommittee,
	ITeacher,
} from "../Types/ModelTypes";

const checkRequestsForCreatingCommittees = async (
	user: IAdmin | ITeacher,
): Promise<StandardResponse | DataResponse> => {
	try {
		let pendingCommittees: ICommittee[];

		const AllPendingCommittees = await committeeModel.find({
			status: CommitteeStatus.PENDING,
		});

		if (user.accType === AccountType.Admin) {
			// Return all committees with committeeOfDepartment having length greater than 1

			pendingCommittees = AllPendingCommittees.filter((e: ICommittee) => {
				return (
					e.committeeOfDepartment.length >= 1 ||
					e.committeeOfDepartment === College.COLLEGE
				);
			});
		} else if (user.accType === AccountType.Teacher) {
			// Return all committees with committeeOfDepartment having length equal to 1

			pendingCommittees = AllPendingCommittees.filter((e: ICommittee) => {
				return (
					e.committeeOfDepartment.length === 1 &&
					e.committeeOfDepartment !== College.COLLEGE &&
					e.committeeOfDepartment[0] === (user as ITeacher).department
				);
			});
		} else {
			const response: StandardResponse = {
				message:
					"For getting pending requests the account should be of Teacher or HOD or admin",
				success: false,
			};

			return response;
		}

		if (!pendingCommittees) {
			const response: StandardResponse = {
				message: "There was some error while finding committee",
				success: false,
			};

			return response;
		}

		const response: DataResponse = {
			message: "Committees found for creation request",
			success: true,
			data: pendingCommittees,
		};

		return response;
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching pending committees" +
				(e as Error).message,
			success: false,
		};

		return response;
	}
};

// TODO:
const checkRequestsForCreatingEvents = () => {};

export { checkRequestsForCreatingCommittees, checkRequestsForCreatingEvents };
