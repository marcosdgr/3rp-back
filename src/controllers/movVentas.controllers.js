// controllers/movVentas.controller.js
import db from "../config/db.js";

export const crearVenta = (req, res) => {
  try {
    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      IdProducto,
      PrecioUnitario,
      ToneladasVendidas,
      TotalVenta,
      FechaVenta,
      Descripcion,
      idUsuario,
    } = req.body;

    // Verificar campos obligatorios
    if (!IdOperacion || !IdPersona || !IdProducto || !idUsuario) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: IdOperacion, IdPersona, IdProducto, idUsuario"
      });
    }

    // Insertar en la base de datos
    const sql = `INSERT INTO movVentas 
      (IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasVendidas, TotalVenta, FechaVenta, Descripcion, idUsuario, Estado) 
      VALUES (?,?,?,?,?,?,?,?,?,'Pendiente')`;

    db.query(
      sql,
      [IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasVendidas, TotalVenta, FechaVenta, Descripcion, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear venta:", error);
          return res.status(500).json({ message: "Error al crear la venta" });
        }

        res.status(201).json({
          message: "Venta creada exitosamente",
          id: results.insertId
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
