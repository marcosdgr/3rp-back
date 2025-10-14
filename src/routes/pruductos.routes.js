import { Router } from "express";

import {
  traerProductos,
  traerProductosActivos,
  crearProducto,
  actualizarProducto,
  borradoLogicoProducto,
  activarProducto,
} from "../controllers/productos.controllers.js"

const router = Router();

// Rutas para productos
// GET
router.get("/productos", traerProductos);
router.get("/productos/activos", traerProductosActivos);

// POST
router.post("/crear", crearProducto);

// PUT
router.put("/actualizar/:idProducto", actualizarProducto);
router.put("/eliminar/:idProducto", borradoLogicoProducto);
router.put("/activar/:idProducto", activarProducto)

export default router;
