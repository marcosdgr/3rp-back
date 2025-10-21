import { Router } from "express";

import { crearVenta, actualizarVenta, traerVentaPorId } from "../controllers/movVentas.controllers.js";

const router = Router();

// POST - Crear venta
router.post("/crear", crearVenta);
// PUT - Actualizar venta
router.put("/actualizar/:idMovVenta", actualizarVenta);
router.get("/buscar/:idMovVenta", traerVentaPorId);


export default router;