import { Router } from "express";
import {
  activarUsuario,
  borradoLogicoUsuario,
  traerUsuarios,
  traerUsuariosActivos,
} from "../controllers/usuarios.controllers.js";
import { validarLogueado, validarRol } from "../middlewares/autenticacion.js";

const router = Router();

// Rutas públicas -
router.get("/", traerUsuarios);
router.get("/activos", traerUsuariosActivos);

// Rutas de administración -
router.put(
  "/eliminar/:idUsuario",
  validarLogueado,
  validarRol,
  borradoLogicoUsuario
);
router.put("/activar/:idUsuariuo", activarUsuario);

export default router;
