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
import { validarRol } from "../middlewares/autenticacion.js";
import { verificarToken } from "../middlewares/authtoken.js";

const router = Router();

// Rutas públicas
router.get("/", traerPersonas);
router.get("/activas", traerPersonasActivas);
router.get("/:tipo", traerPersonasActivasPorTipo);

// Rutas de administración - requieren estar logueado Y ser admin
router.post(
  "/crear",
  
  validarRol,
  validarPersona,
  crearPersona
);
router.put(
  "/actualizar/:idPersona",
  
  validarRol,
  validarPersona,
  actualizarPersona
);
router.put(
  "/eliminar/:idPersona",
  verificarToken,
  validarRol,
  borradoLogicoPersona
);
router.put("/activar/:idPersona", verificarToken, validarRol, activarPersona);

export default router;
