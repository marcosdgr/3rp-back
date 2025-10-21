import { Router } from "express";

import { crearCompra, actualizarCompra, traerCompraPorId } from "../controllers/movCompras.controllers.js";

const router = Router();
// POST - Crear compra
router.post("/crear", crearCompra);
// PUT - Actualizar compra
router.put("/actualizar/:idMovCompra", actualizarCompra);
router.get("/buscar/:idMovCompra", traerCompraPorId);


export default router;