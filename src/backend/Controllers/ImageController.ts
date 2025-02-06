import { Request, Response } from "express";
import { uploadImageToSupabase, deleteImageFromSupabase } from "../Utils/supabase";
import { StandardResponse } from "../Types/GeneralTypes";

const handleUpload = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			const response: StandardResponse = {
				message: "No file uploaded",
				success: false,
			};
			return res.status(401).json(response);
		}

		const filePath = req.body.filePath;

		if (!filePath) {
			const response: StandardResponse = {
				message: "No file path given",
				success: false,
			};
			return res.status(401).json(response);
		}

		// Get the file details
		const { buffer, mimetype } = req.file;
		// Upload the file to Supabase Storage
		await uploadImageToSupabase(filePath, buffer, mimetype);

		const response: StandardResponse = {
			message: "File uploaded successfully",
			success: true,
		};

		return res.status(201).json(response);
	} catch (error) {
		return res.status(500).json({
			error: "Error uploading image: " + (error as Error).message,
		});
	}
};

const handleDelete = async (req: Request, res: Response) => {
	try {
		const filePath = req.params["filePath"];

		if (!filePath) {
			const response: StandardResponse = {
				message: "No file path given",
				success: false,
			};
			return res.status(401).json(response);
		}

		await deleteImageFromSupabase({ filePath });

		return res.status(200).json({ message: "Image deleted successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Error deleting image: " + (error as Error).message });
	}
};

export { handleUpload, handleDelete };
