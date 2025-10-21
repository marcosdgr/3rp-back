import { Router } from "express";
import { crearTransporte, actualizarTransporte, traerTransportePorId } from "../controllers/movTransporte.controllers.js";

const router = Router();
// POST - Crear transporte
router.post("/crear", crearTransporte);
// PUT - Actualizar transporte
router.put("/actualizar/:idMovTransporte", actualizarTransporte);
router.get("/buscar/:idMovTransporte", traerTransportePorId)

export default router;
