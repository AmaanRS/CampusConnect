import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./Routes/UserRouter";
import AdminRouter from "./Routes/AdminRoutes";
import TeacherRouter from "./Routes/TeacherRoutes";
import StudentRouter from "./Routes/StudentRoutes";
import CommitteeRouter from "./Routes/CommitteeRoutes";
import GeneralRouter from "./Routes/GeneralRoutes";
import { fileURLToPath } from "url";
import { isAccountActive } from "./Middlewares/AccountStatus";

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(isAccountActive);

app.use("/", GeneralRouter);
app.use("/user", UserRouter);
app.use("/admin", AdminRouter);
app.use("/teacher", TeacherRouter);
app.use("/student", StudentRouter);
app.use("/committee", CommitteeRouter);

// Connects with db then express server
async function connectToDbAndStartServer(
	MONGO_URI: string,
	PORT: string,
	REPL_SET?: string,
): Promise<void> {
	try {
		if (REPL_SET) {
			await mongoose
				.connect(MONGO_URI, {
					replicaSet: REPL_SET,
					retryWrites: true,
					readPreference: "primary",
					ignoreUndefined: true,
				})
				.then(() => {
					console.log("Database is connected");
					app.listen(PORT, () => {
						console.log(`Express app running on port ${PORT}`);
					});
				})
				.catch((err) => {
					if (err) console.log(err.message);
				});
		} else {
			await mongoose
				.connect(MONGO_URI, {})
				.then(() => {
					console.log("Database is connected");
					app.listen(PORT, () => {
						console.log(`Express app running on port ${PORT}`);
					});
				})
				.catch((err) => {
					if (err) console.log(err.message);
				});
		}
	} catch (e) {
		console.log(`This Express Server is not running because : ${e}`);
	}
}

const __filename = fileURLToPath(import.meta.url);

// If the file was executed directly (not imported as a module)
if (process.argv[1] === __filename) {
	console.log("Connecting from app.ts");

	if (process.env["ENV"]! === "DEV") {
		console.log("Connecting to local db");

		await connectToDbAndStartServer(
			process.env["LOCAL_MONGO_URI"]!,
			process.env["PORT"]!,
			process.env["REPL_SET"]!,
		);
	} else {
		console.log("Connecting to remote db");

		await connectToDbAndStartServer(
			process.env["REMOTE_MONGO_URI"]!,
			process.env["PORT"]!,
		);
	}
}

export { app, connectToDbAndStartServer };
