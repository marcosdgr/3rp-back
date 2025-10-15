import { Router } from "express"
import { 
  crearOperacion,
  actualizarOperacion,
  obtenerOperacionCompleta,
  obtenerTodasLasOperaciones,
  obtenerOperacionesFiltradas
} from "../controllers/operaciones.controllers.js"

const router = Router();

// GET - Obtener TODAS las operaciones
router.get("/", obtenerTodasLasOperaciones);

// GET - Obtener operaciones filtradas por mes y año
router.get("/filtradas", obtenerOperacionesFiltradas);

// GET - Obtener operación completa con todos sus movimientos
router.get("/:idOperacion/completa", obtenerOperacionCompleta);

// POST - Crear operación
router.post("/crear", crearOperacion);

// PUT - Actualizar operación
router.put("/actualizar/:idOperacion", actualizarOperacion);

export default router;