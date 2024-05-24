import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Router } from "./Routes/Router";
import session from "express-session";
import passport from "passport";
import { authRouter } from "./Routes/authRouter";
import { useGoogleStrategy } from "./OAuth/passport.config";

dotenv.config();
useGoogleStrategy();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", Router);
app.use("/auth", authRouter);


async function startServer(): Promise<void> {
	try {
		// Write the database url in the env file
		await mongoose
			.connect(process.env.MONGO_URI!)
			.then(() => {
				console.log("Database is connected");
				app.listen(process.env.PORT!, () => {
					console.log(`Express app running on port ${process.env.PORT}`);
				});
			})
			.catch((err) => {
				if (err) console.log(err.message);
			});
	} catch (e) {
		console.log(`This Express Server is not running because : ${e}`);
	}
}
startServer();
