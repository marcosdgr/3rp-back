import { Router } from "express";
import { borradoLogicoUsuario, traerUsuarios, traerUsuariosActivos } from "../controllers/usuarios.controllers.js";

const router = Router();

// Inicalizo todas rutas para usuarios

// metodos GET
router.get("/", traerUsuarios);
router.get("/activos", traerUsuariosActivos)

// metodos PUT

router.put ("/eliminar/:idUsuario", borradoLogicoUsuario)



export default router;