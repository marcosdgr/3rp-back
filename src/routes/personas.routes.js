import { Router } from "express";
import {
  actualizarPersona,
  borradoLogicoPersona,
  crearPersona,
  traerPersonas,
  traerPersonasActivas,
} from "../controllers/personas.controllers.js";
import {

  validarPersona,
} from "../middlewares/validacionesPersona.js";

const router = Router();

// Definir las rutas para las operaciones CRUD de personas

// metodos post
router.post("/crear", validarPersona, crearPersona);

//metodos get

router.get("/", traerPersonas);
router.get("/activas", traerPersonasActivas);

//metodos put

router.put("/actualizar/:idPersona", validarPersona, actualizarPersona);
router.put("/eliminar/:idPersona", borradoLogicoPersona);

export default router;
