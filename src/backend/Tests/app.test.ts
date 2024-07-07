import { startServer } from "../app";
// import supertest from "supertest";
// const request = supertest(app)
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

jest.mock("mongoose");

describe("Express Server", () => {
	afterAll((done) => {
		mongoose.disconnect();
		jest.clearAllMocks();
		done();
	});

	it("should connect to the database and start the server", async () => {
		const mockConnection = jest.fn().mockResolvedValueOnce({
			connection: {
				db: {
					databaseName: "CampusConnectSelf",
				},
			},
		});

		(mongoose.connect as jest.Mock) = mockConnection;

		await startServer(process.env.MONGO_URI!, process.env.PORT!);

		expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
		expect(mongoose.connect).toHaveBeenCalledTimes(1);
	});
});
