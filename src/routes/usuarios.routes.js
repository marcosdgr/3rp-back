import { Router } from "express";
import {
  borradoLogicoUsuario,
  traerUsuarios,
  traerUsuariosActivos,
} from "../controllers/usuarios.controllers.js";
import { validarRol } from "../middlewares/autenticacion.js";


const router = Router();

// Rutas públicas - sin autenticación
router.get("/", traerUsuarios);
router.get("/activos", traerUsuariosActivos);

// Rutas de administración - sin autenticación
router.put("/eliminar/:idUsuario", validarRol, borradoLogicoUsuario);

export default router;
