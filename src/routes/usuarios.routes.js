import { Router } from "express";
import {
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
router.put("/eliminar/:idUsuario", validarLogueado, validarRol, borradoLogicoUsuario);

export default router;
