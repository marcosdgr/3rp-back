import {Router} from "express";
import { cuentaCorrienteProductor } from "../controllers/cuentacte.controllers.js";
const router = Router();
// Rutas GET

router.get("/:idPersona", cuentaCorrienteProductor);

export default router;



