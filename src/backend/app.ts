import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./Routes/UserRouter";
import AdminRouter from "./Routes/AdminRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", UserRouter);
app.use("/admin", AdminRouter);

async function startServer(
	MONGO_URI: string,
	PORT: string,
	REPL_SET: string,
): Promise<void> {
	try {
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

// Checks if the file was ran using commandline and not by any other means eg testing (If run by testing don't run the server)
if (process.argv[1] === new URL(import.meta.url).pathname) {
	await startServer(
		process.env.MONGO_URI!,
		process.env.PORT!,
		process.env.REPL_SET!,
	);
}

export { app, startServer };
