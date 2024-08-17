import { Request, Response } from "express";
import {
	DataResponse,
	decodedTokenPayload,
	StandardResponse,
} from "../Types/GeneralTypes";
import { userModel } from "../Models/User";
import { adminModel } from "../Models/Admin";
import { AccountType, AdminPosition, IAdmin } from "../Types/ModelTypes";
import { runWithRetrySession } from "../Utils/util";
import { userEmailRegex } from "../Utils/regexUtils";
import { studentModel } from "../Models/Student";
import { teacherModel } from "../Models/Teacher";
import { nonTeachingStaffModel } from "../Models/NonTeachingStaff";
import { UpdateWriteOpResult } from "mongoose";

// When changing from any accountType to admin all the previous data will be lost so be careful
// Creates admin using user jwt token
const createAdmin = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenPayload } = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		// Use session so that transaction is atomic
		const result = await runWithRetrySession(async (session) => {
			// Get the user from db
			const user = await userModel
				.findOne({ email }, { department: 0, __v: 0 })
				.lean()
				.session(session);

			if (!user) {
				const response: StandardResponse = {
					message: "User is not signed up",
					success: false,
				};

				return response;
			}

			// const { _id: userId, ...dataForNewAdmin } = user;

			// Passing old objectId ensures that objectid remains same
			const userId = user._id;
			const { ...dataForNewAdmin } = user;

			// Now that the user is complete set isProfileComplete to true
			const changedUser = await userModel.updateOne(
				{ _id: userId },
				{
					position: [AdminPosition.Admin],
					accType: AccountType.Admin,
					isProfileComplete: true,
				},
				{ session },
			);

			if (!changedUser.acknowledged) {
				const response: StandardResponse = {
					message: "User not updated for isProfileCompleted",
					success: false,
				};

				return response;
			}

			// This will return an array
			const newAdmin: IAdmin[] = await adminModel.create([dataForNewAdmin], {
				session,
			});

			if (!newAdmin || newAdmin.length === 0) {
				const response: StandardResponse = {
					message: "Could not create new admin",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Admin creation successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);

		const response: StandardResponse = {
			message:
				"There is some problem while creating the admin's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Gets the admin whose jwt token is given
const getAdmin = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenPayload } = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const admin: IAdmin | null = await adminModel.findOne(
			{ email },
			{ password: 0 },
		);

		if (!admin) {
			const response: StandardResponse = {
				message: "Could not find admin",
				success: false,
			};
			return res.status(401).json(response);
		}

		const response: DataResponse = {
			message: "Found admin successfully",
			success: true,
			data: admin,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while fetching the admin's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Cannot update email or password through this function
// Updates the admin whose jwt token is given
const updateAdmin = async (req: Request, res: Response) => {
	try {
		const {
			decodedToken,
			position,
		}: { decodedToken: decodedTokenPayload; position: AdminPosition[] } =
			req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		if (position.length === 0) {
			const response: StandardResponse = {
				message: "Send admin data for updation",
				success: false,
			};
			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			// Get the old admin data
			const oldAdmin = await adminModel
				.findOne({ email }, { __v: 0 })
				.session(session)
				.lean();

			if (!oldAdmin) {
				const response: StandardResponse = {
					message: "Could not find the admin",
					success: false,
				};

				return response;
			}

			// Delete the old admin from db
			const isOldAdminDeleted = await adminModel
				.deleteOne({ email })
				.session(session);

			if (!isOldAdminDeleted.acknowledged) {
				const response: StandardResponse = {
					message: "Could not delete the admin while updating",
					success: false,
				};

				return response;
			}

			// Set the new position
			oldAdmin.position = position;

			const dataForUpdatedAdmin = oldAdmin;

			// This returns an array
			const updatedAdmin: IAdmin[] = await adminModel.create(
				[dataForUpdatedAdmin],
				{
					session,
				},
			);

			if (!updatedAdmin || updatedAdmin.length === 0) {
				const response: StandardResponse = {
					message: "Could not update the admin while updating",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Updating admin successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating the admin's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Deletes the admin whose jwt token is given
const deleteAdmin = async (req: Request, res: Response) => {
	try {
		const { decodedToken }: { decodedToken: decodedTokenPayload } = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const email = decodedToken.email;

		if (!email) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const isAdminDeleted = await adminModel.deleteOne({ email: email });

		console.log(isAdminDeleted);

		if (!isAdminDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the admin",
				success: false,
			};

			return res.status(401).json(response);
		}

		if (isAdminDeleted.deletedCount === 0) {
			const response: StandardResponse = {
				message: "Could not find the admin to delete",
				success: false,
			};

			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "Admin deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while deleting the admin's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// This endpoint should only be callable by admin
const changeUserAccountStatusByEmail = async (req: Request, res: Response) => {
	try {
		// Admin's decoded token
		const {
			decodedToken,
			userEmail,
			toggle,
		}: {
			decodedToken: decodedTokenPayload;
			userEmail: string | undefined;
			toggle: boolean | undefined;
		} = req.body;

		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		if (!userEmail) {
			const response: StandardResponse = {
				message: "Send the user which has to be deleted",
				success: false,
			};
			return res.status(401).json(response);
		}

		if (toggle === undefined) {
			const response: StandardResponse = {
				message:
					"Send whether the user's account has to be made active or inactive",
				success: false,
			};
			return res.status(401).json(response);
		}

		if (!userEmailRegex.test(userEmail)) {
			const response: StandardResponse = {
				message: "Send a valid user email",
				success: false,
			};
			return res.status(401).json(response);
		}

		const adminEmail = decodedToken.email;

		if (!adminEmail) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.status(401).json(response);
		}

		const result = await runWithRetrySession(async (session) => {
			const toggledUser = await userModel.findOneAndUpdate(
				{ email: userEmail },
				{ isAccountActive: toggle },
				{ session, new: true },
			);

			if (!toggledUser) {
				const response: StandardResponse = {
					message:
						"Could not find the user or change the given account's active status",
					success: false,
				};

				return response;
			}

			let model: any;
			switch (toggledUser.accType) {
				case AccountType.Student:
					model = studentModel;
					break;

				case AccountType.Admin:
					model = adminModel;
					break;

				case AccountType.Teacher:
					model = teacherModel;
					break;

				case AccountType.NonTeachingStaff:
					model = nonTeachingStaffModel;
					break;
			}

			const toggledUserSpecificUser: UpdateWriteOpResult = await model
				.updateOne(
					{ email: userEmail },
					{ isAccountActive: toggle },
					{ session },
				)
				.lean();

			if (!toggledUserSpecificUser.acknowledged) {
				const response: StandardResponse = {
					message: "Could not change the given account's active status",
					success: false,
				};

				return response;
			}

			const response: StandardResponse = {
				message: "Updating user account status successfull",
				success: true,
			};

			return response;
		});

		return res.status(result.success ? 201 : 401).json(result);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while updating the user's account status by admin" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

export {
	createAdmin,
	getAdmin,
	updateAdmin,
	deleteAdmin,
	changeUserAccountStatusByEmail,
};
