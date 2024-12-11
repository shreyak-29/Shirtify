import express from "express";
import { getAllProductsWithUserInfo } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/products", getAllProductsWithUserInfo);

export default router;
