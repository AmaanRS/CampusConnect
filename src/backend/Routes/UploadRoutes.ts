import express from "express";
import { Request, Response, NextFunction } from "express";
import { handleUpload, handleDelete } from "../Controllers/ImageController";
import { upload } from "../Utils/multer";

const router = express.Router();

// router.post("/upload", upload.single("image"), handleUpload);

router.post(
	"/upload",
	(req: Request, res: Response, next: NextFunction) => {
		upload.single("image")(req, res, (err) => {
			if (err) {
				return res.status(400).json({ error: err.message });
			}
			return next();
		});
	},
	handleUpload,
);

router.post("/delete/:filePath", handleDelete);

export default router;
