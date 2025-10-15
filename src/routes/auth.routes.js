import express from "express";
import { loginUsuario } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/login", loginUsuario);

export default router;
