import { Router } from "express";

import { crearCompra } from "../controllers/movCompras.controllers.js";

const router = Router();
// posts para crear compra
router.post("/crear", crearCompra);

export default router;