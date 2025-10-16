import { Router } from "express";

import { crearCompra, actualizarCompra } from "../controllers/movCompras.controllers.js";

const router = Router();
// POST - Crear compra
router.post("/crear", crearCompra);
// PUT - Actualizar compra
router.put("/actualizar/:idMovCompra", actualizarCompra);

export default router;