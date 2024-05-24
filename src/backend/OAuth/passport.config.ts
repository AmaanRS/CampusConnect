import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { userModel } from "../Models/User";

const GoogleStrategy = passportGoogle.Strategy;

export function useGoogleStrategy() {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID!,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
				callbackURL: "/auth/google/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					//Do something with the profile
					console.log("Access token is ", accessToken);
					console.log("Refresh token is ", refreshToken);
					console.log(profile);
					if (!profile._json.email || !profile._json.name)
						throw "User does not have email or name";

					const user = await userModel.find({ email: profile._json.email });

					if (user.length !== 0) {
						done(null, user);
					} else {
						const newUser = await userModel.create({
							email: profile._json.email,
							username: profile._json.name,
						});

						if (newUser) {
							// User created successfully, pass the new user to done
							return done(null, newUser);
						} else {
							// Failed to create user
							throw new Error("User was not added in database");
						}
					}
				} catch (err: any) {
					console.error(err);
					done(err);
				}
			},
		),
	);

	passport.serializeUser(function (user: Express.User, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user: Express.User, done) {
		done(null, user);
	});
}
