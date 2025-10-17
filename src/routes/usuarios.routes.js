import { Router } from "express";
import {
  activarUsuario,
  borradoLogicoUsuario,
  crearUsuario,
  traerUsuarios,
  traerUsuariosActivos,
} from "../controllers/usuarios.controllers.js";
import { validarRol } from "../middlewares/autenticacion.js";
import { verificarToken } from "../middlewares/authtoken.js";

const router = Router();

// Rutas POST - Crear usuario
router.post("/crear", crearUsuario);

// Rutas GET -
router.get("/", traerUsuarios);
router.get("/activos", traerUsuariosActivos);

// Rutas de borrado y activacion - requieren token y rol admin
router.put(
  "/eliminar/:idUsuario",
  verificarToken,
  validarRol,
  borradoLogicoUsuario
);
router.put("/activar/:idUsuariuo", verificarToken, validarRol, activarUsuario);

export default router;
