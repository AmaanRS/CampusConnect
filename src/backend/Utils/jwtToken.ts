import { StandardResponse, TokenResponse } from "../Types/GeneralTypes";
import jwt from "jsonwebtoken";
import { IAdmin, IStudent, ITeacher, IUser } from "../Types/ModelTypes";

export const createJwtToken = (
	user: IUser | IStudent | ITeacher | IAdmin,
): StandardResponse | TokenResponse => {
	try {
		const token = jwt.sign(
			{
				email: user.email,
				position: [...user.position],
				accountType: user.accType,
				isProfileComplete: user.isProfileComplete,
				isAccountActive: user.isAccountActive,
			},
			process.env.JWT_SECRET!,
		);

		const response: TokenResponse = {
			message: "The password matches",
			success: true,
			token: token,
		};

		return response;
	} catch (error) {
		const response: StandardResponse = {
			message: "Could not create JWT token " + error,
			success: false,
		};

		return response;
	}
};
