import { Request, Response } from "express";
import { DataResponse, StandardResponse } from "../Types/GeneralTypes";
import { userModel } from "../Models/User";
import { adminModel } from "../Models/Admin";
import mongoose from "mongoose";
import { AccountType, AdminPosition } from "../Types/ModelTypes";
import { runWithRetrySession } from "../Utils/util";

const createAdmin = async (req: Request, res: Response) => {
	try {
		const { decodedToken } = req.body;
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

		const result = await runWithRetrySession(async (session) => {
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

			const { _id: userId, ...dataForNewAdmin } = user;

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
			const newAdmin = await adminModel.create([dataForNewAdmin], {
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

const getAdmin = async (req: Request, res: Response) => {
	try {
		const { decodedToken } = req.body;
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

		const admin = await adminModel.findOne({ email }, { password: 0 });

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
				"There is some problem while creating the admin's account" +
				(e as Error).message,
			success: false,
		};

		return res.status(401).json(response);
	}
};

// Cannot update email or password through this function
const updateAdmin = async (req: Request, res: Response) => {
	const session = await mongoose.startSession();
	const maxRetries = 4;
	let retryCount = 0;
	try {
		const { decodedToken, adminData } = req.body;
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

		if (!adminData || !adminData?.position) {
			const response: StandardResponse = {
				message: "Send admin data for updation",
				success: false,
			};
			return res.status(401).json(response);
		}

		const { position } = adminData;

		let successful = false;

		while (retryCount < maxRetries && !successful) {
			try {
				session.startTransaction();

				// Get the old admin data
				const oldAdmin = await adminModel
					.findOne({ email })
					.session(session);

				if (!oldAdmin) {
					const response: StandardResponse = {
						message: "Could not find the admin",
						success: false,
					};
					await session.abortTransaction();
					await session.endSession();

					return res.status(401).json(response);
				}

				const isOldAdminDeleted = await adminModel
					.deleteOne({ email })
					.session(session);

				if (!isOldAdminDeleted.acknowledged) {
					const response: StandardResponse = {
						message: "Could not delete the admin while updating",
						success: false,
					};
					await session.abortTransaction();
					await session.endSession();

					return res.status(401).json(response);
				}

				// Password will be getting hashed two times so the password entered will not be usable so correct this
				const dataForUpdatedAdmin = { ...oldAdmin, position: position };

				// This returns an array
				const updatedAdmin = await adminModel.create([dataForUpdatedAdmin], {
					session,
				});

				if (!updatedAdmin || updatedAdmin.length === 0) {
					const response: StandardResponse = {
						message: "Could not update the admin while updating",
						success: false,
					};
					await session.abortTransaction();
					await session.endSession();

					return res.status(401).json(response);
				}

				const response: StandardResponse = {
					message: "Updating admin successfull",
					success: true,
				};
				await session.commitTransaction();
				await session.endSession();
				successful = true;

				return res.status(201).json(response);
			} catch (e) {
				console.log((e as Error).message);
				if (session.inTransaction()) {
					await session.abortTransaction();
				}

				//Ony for Write Conflict
				// 112 is the MongoDB WriteConflict error code
				if (e instanceof mongoose.mongo.MongoError && e.code === 112) {
					retryCount++;
					console.log(`Retry ${retryCount}/${maxRetries}`);
				} else {
					throw e;
				}

				// Exponential backoff
				await new Promise((resolve) =>
					setTimeout(resolve, Math.pow(2, retryCount) * 500),
				);
			}
		}
		const response: StandardResponse = {
			message: "Could not update the admin while updating",
			success: false,
		};
		if (session.inTransaction()) {
			await session.abortTransaction();
		}

		await session.endSession();

		return res.status(401).json(response);
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

const deleteAdmin = async (req: Request, res: Response) => {
	try {
		const { decodedToken } = req.body;
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

		if (!isAdminDeleted.acknowledged) {
			const response: StandardResponse = {
				message: "Could not delete the user",
				success: false,
			};
			return res.status(401).json(response);
		}

		const response: StandardResponse = {
			message: "User deleted successfully",
			success: true,
		};

		return res.status(201).json(response);
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

export { createAdmin, getAdmin, updateAdmin, deleteAdmin };
