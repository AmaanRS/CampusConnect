import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {
	DataResponse,
	StandardResponse,
	TokenResponse,
} from "../Types/GeneralTypes";
import { MongooseError } from "mongoose";
import { userModel } from "../Models/User";
import { IUser } from "../Types/ModelTypes";
import { checkPassAgainstDbPass } from "../Utils/util";

const login = async (req: Request, res: Response) => {
	try {
		//Get the data from the request
		const {
			email,
			password,
		}: { email: string | undefined; password: string | undefined } = req.body;

		//If email and password exist
		if (email && password) {
			//Try to get the document from the database using email
			let user: IUser | null = await userModel.findOne({ email: email });

			//If the database does not returns the data of the user
			if (!user) {
				const response: StandardResponse = {
					message: "Either email or password entered is wrong",
					success: false,
				};

				return res.json(response);
			}

			let matchPassword = await checkPassAgainstDbPass(
				password,
				user.password,
			);

			//If the passwords do not match
			if (!matchPassword?.success) {
				const response: StandardResponse = {
					message:
						matchPassword?.message ??
						"Either email or password entered is wrong",
					success: matchPassword?.success ?? false,
				};

				return res.json(response);
			}

			//Create a jwt token
			let token: string = jwt.sign({ email: email }, process.env.JWT_SECRET!);

			//Send the message to the frontend that the user is now logged in
			const response: TokenResponse = {
				message: "You have been logged in successfully",
				success: true,
				token: token,
			};

			return res.json(response);
		}
		//If either email or password does not exist
		else {
			const response: StandardResponse = {
				message: "Enter both email and password",
				success: false,
			};
			return res.json(response);
		}
	} catch (e) {
		console.log("There is some error while logging in");

		//Logging the error
		console.log((e as Error).message);

		//Send the message to the frontend that the user is not logged in
		const response: StandardResponse = {
			message: "There is some problem in logging in" + (e as Error).message,
			success: false,
		};

		return res.json(response);
	}
};

const signup = async (req: Request, res: Response) => {
	try {
		const {
			email,
			password,
		}: {
			email: string | undefined;
			password: string | undefined;
		} = req.body;

		if (email && password) {
			//Validation for Email is in User model

			//
			//
			// Check if validation and hashing is being done on the password or not
			//
			//

			// Validation for Password
			// Validation is done here because hashed password is being stored rather than plain text

			// At least one lowercase letter
			// At least one uppercase letter
			// At least one digit
			// At least one special character
			// Total length between 8 and 10 characters
			// const passwordRegex =
			// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
			// const isPassValid = passwordRegex.test(password);

			// if (!isPassValid) {
			// 	const response: StandardResponse = {
			// 		message:
			// 			"Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long",
			// 		success: false,
			// 	};
			// 	return res.json(response);
			// }

			// const hashedPassword: string = await bcrypt.hash(password, 8);

			try {
				await userModel.create({
					email: email,
					password: password,
				});
			} catch (error) {

				const response: StandardResponse = {
					// message: (error as MongooseError).message.split(":")[2].trim(),
					message: (error as MongooseError).message,
					success: false,
				};
				return res.json(response);
			}

			const response: StandardResponse = {
				message: "Your account has been created now you can login",
				success: true,
			};
			return res.json(response);
		} else {
			const response: StandardResponse = {
				message: "Enter both email and password",
				success: false,
			};
			return res.json(response);
		}
	} catch (e) {
		//Logging the error
		console.log((e as Error).message);

		// This error is handled in above nested try catch block
		// if ((e as any).code == 11000) {
		// 	return res.json({
		// 		message: "This email is already registered",
		// 		success: false,
		// 	});
		// }

		//Send the message to the frontend that the user's account is not created
		const response: StandardResponse = {
			message: "There is some problem in signning up" + (e as Error).message,
			success: false,
		};

		return res.json(response);
	}
};

const profileStatus = async (req: Request, res: Response) => {
	try {
		//This check is necessary because if their is some other middleware interfering with the req and token does'nt get here
		const { decodedToken } = req.body;
		if (!decodedToken) {
			const response: StandardResponse = {
				message: "User is not authenticated",
				success: false,
			};
			return res.json(response);
		}
		const isProfileComplete:IUser|null = await userModel.findOne(
			{
				email: decodedToken.email,
			},
			{ password:0 },
		);
		if (!isProfileComplete) {
			throw new Error(
				"isProfileComplete does not exists on this user's model check it",
			);
		}
		const response: DataResponse = {
			message: "Fetched data successfully",
			success: true,
			data: isProfileComplete,
		};

		return res.json(response);
	} catch (e) {
		console.log((e as Error).message);
		const response: StandardResponse = {
			message:
				"There is some problem while getting the user's profile status" +
				(e as Error).message,
			success: false,
		};

		return res.json(response);
	}
};

//Password and email should not be updated using this endpoint
// const updateUserProfile = async (req: UpdateRequest, res: Response) => {
// 	const session = await mongoose.startSession();
// 	const maxRetries = 4;
// 	let retryCount = 0;

// 	try {
// 		//Validate the data before creating the model check for User model for validations if already existing validations work then good
// 		const { decodedToken, data } = req.body;

// 		if (!decodedToken) {
// 			const response: StandardResponse = {
// 				message: "User is not authenticated",
// 				success: false,
// 			};
// 			return res.json(response);
// 		}

// 		if (!data) {
// 			const response: StandardResponse = {
// 				message: "Send data to be used for updating",
// 				success: false,
// 			};
// 			return res.json(response);
// 		}

// 		// Runtime check to ensure 'password' field is not present
// 		if ("password" in data) {
// 			const response: StandardResponse = {
// 				message: "Password should not be updated using this endpoint",
// 				success: false,
// 			};
// 			return res.json(response);
// 		}

// 		// Email sent in data and decodedToken.email should be same
// 		if (decodedToken.email !== data.email) {
// 			const response: StandardResponse = {
// 				message:
// 					"The email of the user sending the request and the email in the data sent for updation is different",
// 				success: false,
// 			};

// 			return res.json(response);
// 		}
// 		let successful = false;

// 		while (retryCount < maxRetries && !successful) {
// 			try {
// 				session.startTransaction();

// 				const oldUser = await userModel
// 					.findOne({ email: decodedToken.email })
// 					.session(session);

// 				if (!oldUser) {
// 					const response: StandardResponse = {
// 						message: "Cannot find the user",
// 						success: false,
// 					};

// 					await session.abortTransaction();
// 					await session.endSession();
// 					return res.json(response);
// 				}

// 				const isDeleted = await oldUser
// 					.deleteOne({ email: oldUser.email })
// 					.session(session);

// 				// COULD NOT SIMULATE AS TEST
// 				if (!isDeleted.acknowledged) {
// 					await session.abortTransaction();
// 					await session.endSession();
// 					throw new Error(
// 						"Could not delete user's data while updating user's profile",
// 					);
// 				}

// 				// Set the password and email from the oldUser as a password and email for the newUser
// 				const dataToCreateUserFrom = {
// 					...data,
// 					password: oldUser.password,
// 					email: oldUser.email,
// 				};

// 				const updatedUser = await userModel.create([dataToCreateUserFrom], {
// 					session,
// 				});

// 				// COULD NOT SIMULATE AS TEST
// 				if (!updatedUser) {
// 					await session.abortTransaction();
// 					await session.endSession();
// 					const response: StandardResponse = {
// 						message: "Could not recreate the user while updating",
// 						success: false,
// 					};
// 					return res.json(response);
// 				}

// 				await session.commitTransaction();
// 				await session.endSession();

// 				const response: StandardResponse = {
// 					message: "User updated successfully",
// 					success: true,
// 				};

// 				return res.json(response);
// 			} catch (e: any) {
// 				console.log((e as Error).message);

// 				if (session.inTransaction()) {
// 					await session.abortTransaction();
// 				}

// 				// COULD NOT SIMULATE AS TEST
// 				//Ony for Write Conflict
// 				// 112 is the MongoDB WriteConflict error code
// 				if ((e as Error).name === "MongoError" && e.code === 112) {
// 					retryCount++;
// 					console.log(`Retry ${retryCount}/${maxRetries}`);
// 				} else {
// 					throw e;
// 				}
// 				await new Promise((resolve) =>
// 					setTimeout(resolve, Math.pow(2, retryCount) * 100),
// 				); // Exponential backoff
// 			}
// 		}
// 	} catch (e) {
// 		console.log(e as Error);

// 		// COULD NOT SIMULATE AS TEST
// 		if (session.inTransaction()) {
// 			await session.abortTransaction();
// 		}
// 		await session.endSession();

// 		const response: StandardResponse = {
// 			message:
// 				"There is some problem while updating the user's profile " +
// 				(e as Error).message,
// 			success: false,
// 		};
// 		return res.json(response);
// 	}
// };

// const mainPage = async (req, res) => {
// 	//The user is not authenticated
// 	if (!req.middlewareRes.success) {
// 		return res.json({
// 			message: req.middlewareRes.message,
// 			success: req.middlewareRes.success,
// 		});
// 	}
// 	//The user is authenticated and you can do the operations
// 	return res.json({ message: "The user is authenticated", success: true });
// };

// const getUserData = async (req, res) => {
// 	try {
// 		//User is not authenticated
// 		if (!req.middlewareRes.success) {
// 			return res.json({
// 				message: req.middlewareRes.message,
// 				success: req.middlewareRes.success,
// 			});
// 		}

// 		//Get the payload from the token
// 		const { decodedToken } = req.middlewareRes;

// 		//If the token does not exist or the payload in the token does not exist
// 		if (!decodedToken || !decodedToken.email) {
// 			return res.json({ message: "Cannot get users data", success: false });
// 		}

// 		//Get the user from the database
// 		const userData = await userModel.findOne({ email: decodedToken.email });

// 		//If the user does not exist
// 		if (!userData) {
// 			return res.json({ message: "Cannot get users data", success: false });
// 		}

// 		const friends = (await userData.populate("friends", "email _id")).friends;

// 		if (!friends) {
// 			return res.json({ message: "Cannot get users data", success: false });
// 		}

// 		return res.json({
// 			message: "User's data fetched successfully",
// 			success: true,
// 			email: userData.email,
// 			friends: friends,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.json({ message: "Cannot get users data", success: false });
// 	}
// };

// const getAllUsersEmail = async (req, res) => {
// 	try {
// 		//User is not authenticated
// 		if (!req.middlewareRes.success) {
// 			return res.json({
// 				message: req.middlewareRes.message,
// 				success: req.middlewareRes.success,
// 			});
// 		}

// 		const { decodedToken } = req.middlewareRes;

// 		//Return an array of email objects
// 		const allUserEmails = await userModel.find(
// 			{
// 				email: { $ne: decodedToken.email },
// 			},
// 			{ email: 1, _id: 0 },
// 		);

// 		if (!allUserEmails) {
// 			return res.json({ message: "Could not fetch all Users", success: false });
// 		}

// 		let listOfEmails = [];

// 		//Gets the array of emails
// 		allUserEmails.map((emailObj) => {
// 			listOfEmails.push(emailObj.email);
// 		});

// 		return res.json({
// 			message: "Fetched all emails successfully",
// 			success: true,
// 			listOfEmails: listOfEmails,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.json({ message: "Cannot get  all users data", success: false });
// 	}
// };

// const addFriendBothWays = async (req, res) => {
// 	let session;
// 	try {
// 		//User is not authenticated
// 		if (!req.middlewareRes.success) {
// 			return res.json({
// 				message: req.middlewareRes.message,
// 				success: req.middlewareRes.success,
// 			});
// 		}

// 		const { friendEmail } = req.body;
// 		//Email id of user
// 		const { decodedToken } = req.middlewareRes;

// 		//If the token does not exist or the payload in the token does not exist
// 		if (!decodedToken || !decodedToken.email) {
// 			return res.json({ message: "Cannot get users data", success: false });
// 		}

// 		//Cannot make friend of yourself
// 		if (friendEmail === decodedToken.email) {
// 			console.log("Inside");
// 			return res.json({
// 				message: "Cannot become friends with yourself",
// 				success: false,
// 			});
// 		}

// 		//Though I have written the session code I have no way to find whether it works or not
// 		//Session management is required to make the transaction atomic
// 		session = await mongoose.startSession();
// 		session.startTransaction();

// 		const User1 = await userModel.findOne({ email: decodedToken.email });
// 		const User2 = await userModel.findOne({ email: friendEmail });

// 		if (!User1 || !User2) {
// 			return res.json({ message: "Could not add Friend", success: false });
// 		}

// 		//Get the array of friends of User1
// 		let friends1 = (await User1.populate("friends", "email")).friends;

// 		//If User1 is already a friend of User2 return false
// 		let isAlreadyFriends = false;

// 		for (const obj of friends1) {
// 			if (obj.email === friendEmail) {
// 				isAlreadyFriends = true;
// 				break;
// 			}
// 		}

// 		if (isAlreadyFriends) {
// 			return res.json({
// 				message: "You are already Friends with the user",
// 				success: false,
// 			});
// 		}

// 		//Add User2 to friends array field of User1
// 		const updatedUser1 = await userModel.findByIdAndUpdate(
// 			User1._id,
// 			{
// 				$push: {
// 					friends: User2._id,
// 				},
// 			},
// 			{ new: true },
// 		);

// 		//Add User1 to friends array field of User2
// 		const updatedUser2 = await userModel.findByIdAndUpdate(
// 			User2._id,
// 			{
// 				$push: {
// 					friends: User1._id,
// 				},
// 			},
// 			{ new: true },
// 		);

// 		//Check which email is lexicographically first the add it as Friend1
// 		if (decodedToken.email < friendEmail) {
// 			//Create a new conversation for the friend which was added
// 			const isConvCreated = await conversationModel.create({
// 				Friend1: User1._id,
// 				Friend2: User2._id,
// 			});
// 		} else if (friendEmail < decodedToken.email) {
// 			//Create a new conversation for the friend which was added
// 			const isConvCreated = await conversationModel.create({
// 				Friend1: User2._id,
// 				Friend2: User1._id,
// 			});
// 		}

// 		//
// 		//     //Duplicate code
// 		//

// 		//Remove the friends key of user from redis
// 		await pub.del(`friends:${decodedToken.email}`);

// 		//Update the Redis after adding friends
// 		//Get the id of user
// 		const userId = User1._id;

// 		if (!userId) {
// 			return res.json({
// 				message: "Could not get user id from the database",
// 				success: false,
// 			});
// 		}

// 		//Get all the conversations which user is a part of ie all the friends of users
// 		const conversations = await conversationModel.find(
// 			{
// 				$or: [{ Friend1: userId }, { Friend2: userId }],
// 			},
// 			"Friend1 Friend2",
// 		);

// 		//Add the friends inside redis list
// 		for (let index = 0; index < conversations.length; index++) {
// 			const Friend1Email = (
// 				await userModel.findOne({ _id: conversations[index].Friend1 })
// 			).email;

// 			const Friend2Email = (
// 				await userModel.findOne({ _id: conversations[index].Friend2 })
// 			).email;

// 			await pub.rpush(
// 				`friends:${decodedToken.email}`,
// 				`${Friend1Email}_${Friend2Email}`,
// 			);
// 		}

// 		await session.commitTransaction();
// 		session.endSession();

// 		return res.json({
// 			message: "Friend added successfully",
// 			success: true,
// 		});
// 	} catch (error) {
// 		await session.abortTransaction();
// 		session.endSession();

// 		console.log(error);
// 		return res.json({ message: "Could not add as friends", success: false });
// 	}
// };

// const getUserConversation = async (req, res) => {
// 	try {
// 		//User is not authenticated
// 		if (!req.middlewareRes.success) {
// 			return res.json({
// 				message: req.middlewareRes.message,
// 				success: req.middlewareRes.success,
// 			});
// 		}

// 		//Email id of user
// 		const { decodedToken } = req.middlewareRes;

// 		const { friendEmail } = req.body;

// 		if (!friendEmail) {
// 			return res.json({ message: "Provide a friendEmail", success: false });
// 		}

// 		const friendId = (await userModel.findOne({ email: friendEmail }))._id;

// 		const userId = (await userModel.findOne({ email: decodedToken.email }))._id;

// 		if (!userId || !friendId) {
// 			return res.json({
// 				message: "Could not get both the friend and user id from the database",
// 				success: false,
// 			});
// 		}

// 		//Conversation storage format "conv:Friend1Email_Friend2Email"

// 		let doesConvExist;
// 		let keyString;

// 		//Check if the conversation exists in redis for both combination of key

// 		if (decodedToken.email < friendEmail) {
// 			keyString = `conv:${decodedToken.email}_${friendEmail}`;
// 		} else {
// 			keyString = `conv:${friendEmail}_${decodedToken.email}`;
// 		}

// 		doesConvExist = await pub.lrange(keyString, 0, -1);

// 		//If now the conversation exists in Redis ie either of the key combination exists and the length of the conversation array is not zero
// 		if (doesConvExist && doesConvExist.length !== 0) {
// 			//Remove expiration from conv
// 			await pub.persist(keyString);

// 			//Return the data from Redis
// 			return res.json({
// 				message: "Got the Conversation successfully from Redis",
// 				success: true,
// 				conversation: doesConvExist,
// 			});
// 		}

// 		//This can be optimized by check which email is lexicographically first then finding it
// 		let userConversation = await conversationModel
// 			.find({
// 				$and: [
// 					{ $or: [{ Friend1: userId }, { Friend1: friendId }] },
// 					{ $or: [{ Friend2: userId }, { Friend2: friendId }] },
// 				],
// 			})
// 			.lean();

// 		if (!userConversation && !userConversation.ContentField) {
// 			return res.json({
// 				message: "Unable to find Conversation",
// 				success: false,
// 			});
// 		}

// 		let conversation = [];

// 		for (const e of userConversation[0]?.ContentField || []) {
// 			if (e.sender == userId.toString()) {
// 				e.sender = decodedToken.email;
// 				e.receiver = friendEmail;
// 			} else {
// 				e.sender = friendEmail;
// 				e.receiver = decodedToken.email;
// 			}
// 			// Since the conversation does not exist in Redis add it
// 			// Push every new object at the end of list in Redis
// 			await pub.rpush(keyString, JSON.stringify(e));
// 			conversation.push(e);
// 		}

// 		//Return the data
// 		return res.json({
// 			message: "Got the Conversation successfully from database",
// 			success: true,
// 			conversation: conversation,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return res.json({ message: "Could not add as friends", success: false });
// 	}
// };

export {
	login,
	signup,
	profileStatus,
	// updateUserProfile,
	// mainPage,
	// getUserData,
	// getAllUsersEmail,
	// addFriendBothWays,
	// getUserConversation,
};
