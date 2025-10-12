import db from "../config/db.js";

// traer todos los productos
export const traerProductos = async (req, res) => {
  try {
    const traerTodosLosProductos = `SELECT * FROM PRODUCTOS`;
    db.query(traerTodosLosProductos, (error, results) => {
      if (error) {
        console.error("Error al traer productos: ", error);
        res.status(500).json({ message: "Error al traer productos" });
      }
      res.status(200).json(results);
    });
  } catch (error) {}
};

// traer productos activos

export const traerProductosActivos = async (req, res) => {
  try {
    const traerSoloActivos = `SELECT * FROM PRODUCTOS WHERE IsActive = 1`;
    db.query(traerSoloActivos, (error, results) => {
      if (error) {
        console.error("Error al traer productos activos: ", error);
        res.status(500).json({ message: "Error al traer productos activos" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// crear un producto
export const crearProducto = async (req, res) => {
  try {
    const { nombreProducto, Descripcion } = req.body;
    if (!nombreProducto) {
      return res
        .status(400)
        .json({ message: "El nombre del producto es obligatorio" });
    }
    const crear = `INSERT INTO PRODUCTOS (nombreProducto, Descripcion, IsActive) VALUES (?,?,1)`;
    db.query(crear, [nombreProducto, Descripcion], (error, results) => {
      if (error) {
        console.error("Error al crear producto:", error);
        return res.status(500).json({ message: "Error al crear el producto" });
      }
      res.status(201).json({
        message: "Producto creado exitosamente",
        id: results.insertId,
      });
    });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// actualizar un producto existente
export const actualizarProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const { nombreProducto, Descripcion } = req.body;
    if (!idProducto) {
      return res.status(400).json({ message: "ID de producto requerido" });
    }
    const actualizar = `UPDATE PRODUCTOS SET nombreProducto = ?, Descripcion = ? WHERE idProducto = ?`;
    db.query(
      actualizar,
      [nombreProducto, Descripcion, idProducto],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar producto:", error);
          return res
            .status(500)
            .json({ message: "Error al actualizar el producto" });
        }
        res.status(200).json({ message: "Producto actualizado exitosamente" });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// borrado logico de un producto
export const borradoLogicoProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const borrarProducto = `UPDATE PRODUCTOS SET IsActive = 0 WHERE idProducto = ?`;
    db.query(borrarProducto, [idProducto], (error, results) => {
      if (error) {
        console.error("Error al eliminar producto: ", error);
        return res.status(500).json({ message: "Error al eliminar producto" });
      }
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    });
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
