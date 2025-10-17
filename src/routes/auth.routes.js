import express from "express";
import { loginUsuario } from "../controllers/auth.controllers.js";

const router = express.Router();

// Ruta para login - Devuelve token JWT
router.post("/login", loginUsuario);

export default router;
