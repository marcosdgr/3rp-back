import db from "../config/db.js";

export const crearCompra = (req, res) => {
  try {
    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      IdProducto,
      PrecioUnitario,
      ToneladasCompradas,
      TotalCompra,
      FechaCompra,
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
    const sql = `INSERT INTO movCompras 
      (IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasCompradas, TotalCompra, FechaCompra, Descripcion, idUsuario, Estado) 
      VALUES (?,?,?,?,?,?,?,?,?,'Pendiente')`;

    db.query(
      sql,
      [IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasCompradas, TotalCompra, FechaCompra, Descripcion, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear compra:", error);
          return res.status(500).json({ message: "Error al crear la compra" });
        }

        res.status(201).json({
          message: "Compra creada exitosamente",
          id: results.insertId
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
