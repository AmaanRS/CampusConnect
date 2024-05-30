import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Router } from "./Routes/Router";
import session from "express-session";
import passport from "passport";

dotenv.config();
const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", Router);

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
