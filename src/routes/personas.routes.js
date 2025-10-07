import { Router } from "express";
import {
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
router.post("/crear", validarLogueado, validarRol, validarPersona, crearPersona);
router.put(
  "/actualizar/:idPersona",
  validarLogueado,
  validarRol,
  validarPersona,
  actualizarPersona
);
router.put("/eliminar/:idPersona", validarLogueado, validarRol, borradoLogicoPersona);

export default router;
