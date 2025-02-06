import multer from "multer";
// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export { upload };
