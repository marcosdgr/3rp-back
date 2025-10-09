import { Router } from "express";

import { crearVenta } from "../controllers/movVentas.controllers.js";

const router = Router();

// posts para crear venta
router.post("/crear", crearVenta);

export default router;