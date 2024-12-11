import express from "express";
import multer from "multer";
import { uploadImage, testServer } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), uploadImage);
router.get("/test", testServer);

export default router;
