import { Router } from "express";

import {
  traerProductos,
  traerProductosActivos,
  crearProducto,
  actualizarProducto,
  borradoLogicoProducto,
  activarProducto,
  traerProductosActivosPorId,
} from "../controllers/productos.controllers.js"

const router = Router();

// Rutas para productos
// GET
router.get("/", traerProductos);
router.get("/activos", traerProductosActivos);
router.get("/activos/:idProducto", traerProductosActivosPorId);

// POST
router.post("/crear", crearProducto);

// PUT
router.put("/actualizar/:idProducto", actualizarProducto);
router.put("/eliminar/:idProducto", borradoLogicoProducto);
router.put("/activar/:idProducto", activarProducto)

export default router;
