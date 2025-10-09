import { Router } from "express";
import { crearTransporte } from "../controllers/movTransporte.controllers.js";

const router = Router();
// post para crear transporte
router.post("/crear", crearTransporte);
export default router;
