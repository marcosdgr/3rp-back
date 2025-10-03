import { Router } from "express";
import { borradoLogicoUsuario, traerUsuarios } from "../controllers/usuarios.controllers.js";

const router = Router();

// Inicalizo todas rutas para usuarios

// metodos GET
router.get("/", traerUsuarios);

// metodos PUT

router.put ("/eliminar/:id", borradoLogicoUsuario)



export default router;