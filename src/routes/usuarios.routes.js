import { Router } from "express";
import {
  borradoLogicoUsuario,
  traerUsuarios,
  traerUsuariosActivos,
} from "../controllers/usuarios.controllers.js";
import { verificarToken } from "../middlewares/authtoken.js";
import { validarRol } from "../middlewares/autenticacion.js";

const router = Router();

// Rutas protegidas - requieren autenticación
router.get("/", traerUsuarios);
router.get("/activos", traerUsuariosActivos);

// Rutas administrativas - requieren autenticación y rol admin
router.put("/eliminar/:idUsuario",verificarToken, validarRol, borradoLogicoUsuario);

export default router;
