import { Router } from "express";
import {
  activarPersona,
  actualizarPersona,
  borradoLogicoPersona,
  crearPersona,
  traerPersonas,
  traerPersonasActivas,
  traerPersonasActivasPorTipo,
} from "../controllers/personas.controllers.js";
import { validarPersona } from "../middlewares/validacionesPersona.js";
import { validarLogueado, validarRol } from "../middlewares/autenticacion.js";

const router = Router();

// Rutas públicas
router.get("/", traerPersonas);
router.get("/activas", traerPersonasActivas);
router.get("/:tipo", traerPersonasActivasPorTipo);

// Rutas de administración - requieren estar logueado Y ser admin
router.post(
  "/crear",
  crearPersona
);
router.put(
  "/actualizar/:idPersona",
  validarPersona,
  actualizarPersona
);
router.put(
  "/eliminar/:idPersona",
  validarLogueado,
  validarRol,
  borradoLogicoPersona
);
router.put("/activar/:idPersona", activarPersona);

export default router;
