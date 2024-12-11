import express from "express";
import { createDesign, getDesigns } from "../controllers/designController.js";

const router = express.Router();

router.post("/", createDesign);
router.get("/", getDesigns);

export default router;
