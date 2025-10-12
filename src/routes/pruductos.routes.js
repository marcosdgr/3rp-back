import { Router } from "express";

import {
  traerProductos,
  traerProductosActivos,
  crearProducto,
  actualizarProducto,
  borradoLogicoProducto,
} from "../controllers/productos.controllers";

const router = Router();

// Rutas para productos
// GET
router.get("/productos", traerProductos);
router.get("/productos/activos", traerProductosActivos);

// POST
router.post("/productos", crearProducto);

// PUT
router.put("/productos/:idProducto", actualizarProducto);
router.put("/productos/:idProducto", borradoLogicoProducto);

export default router;
