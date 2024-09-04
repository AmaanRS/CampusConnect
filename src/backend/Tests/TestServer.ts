import mongoose from "mongoose";
import { app } from "../app";
import { Server } from "http";

let serverRef: Server;

// Connects with db then express server
async function connectToTestDbAndStartTestServer(
	TEST_MONGO_URI: string,
	PORT: string,
): Promise<void> {
	try {
		mongoose
			.connect(TEST_MONGO_URI)
			.then(() => {
				console.log("Database is connected");

				serverRef = app.listen(PORT, () => {
					console.log(`Express app running on port ${PORT}`);
				});
			})
			.catch((err) => {
				if (err) console.log(err.message);
			});
	} catch (e) {
		console.log(`This Express Server is not running because : ${e}`);
	}
}

// Stops only the express server
function stopTestServerRunning(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (serverRef) {
			serverRef.close((err: any) => {
				if (err) return reject(err);
				console.log("Server stopped");
				resolve();
			});
		} else {
			console.log("Server is not running");
			resolve();
		}
	});
}

export { connectToTestDbAndStartTestServer, stopTestServerRunning };
