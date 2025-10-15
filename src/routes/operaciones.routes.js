import { Router } from "express"
import { 
  crearOperacion, 
  obtenerOperacionCompleta,
  obtenerTodasLasOperaciones,
  obtenerOperacionesFiltradas ,
   // ✅ Agregar esta importación
} from "../controllers/operaciones.controllers.js"
import { validarLogueado } from "../middlewares/autenticacion.js";

const router = Router();

// GET - Obtener TODAS las operaciones
router.get("/", obtenerTodasLasOperaciones);

// GET - Obtener operaciones filtradas por mes y año
router.get("/filtradas", obtenerOperacionesFiltradas);

// GET - Obtener operación completa con todos sus movimientos
router.get("/:idOperacion/completa", obtenerOperacionCompleta);

// POST - Crear operación
router.post("/crear", validarLogueado ,crearOperacion);

export default router;