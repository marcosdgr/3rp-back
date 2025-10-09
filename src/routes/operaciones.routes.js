import { Router } from "express"
import { crearOperacion, obtenerOperacionCompleta } from "../controllers/operaciones.controllers.js"

const router = Router();

// GET - Obtener operación completa con todos sus movimientos
router.get("/:idOperacion/completa", obtenerOperacionCompleta);

// POST - Crear operación
router.post("/crear", crearOperacion);


export default router;