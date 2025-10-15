import { Router } from "express";
import { crearTransporte, actualizarTransporte } from "../controllers/movTransporte.controllers.js";

const router = Router();
// POST - Crear transporte
router.post("/crear", crearTransporte);
// PUT - Actualizar transporte
router.put("/actualizar/:idMovTransporte", actualizarTransporte);
export default router;
