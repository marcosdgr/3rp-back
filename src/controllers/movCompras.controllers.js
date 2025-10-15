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
      FechaCompra,
      Descripcion,
      idUsuario,
    } = req.body;

    // Verificar campos obligatorios
    if (!IdOperacion || !IdPersona || !IdProducto || !idUsuario || !PrecioUnitario || !ToneladasCompradas) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasCompradas, idUsuario"
      });
    }

    // CALCULAR TOTAL COMPRA = PrecioUnitario * ToneladasCompradas
    const totalCompra = Number(PrecioUnitario) * Number(ToneladasCompradas);

    // Insertar en la base de datos
    const crear = `INSERT INTO movCompras 
      (IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasCompradas, TotalCompra, FechaCompra, Descripcion, idUsuario, Estado) 
      VALUES (?,?,?,?,?,?,?,?,?,'Pendiente')`;

    db.query(
      crear,
      [IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasCompradas, totalCompra, FechaCompra, Descripcion, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear compra:", error);
          return res.status(500).json({ message: "Error al crear la compra" });
        }

        res.status(201).json({
          message: "Compra creada exitosamente",
          id: results.insertId,
          TotalCompra: totalCompra
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar una compra existente
export const actualizarCompra = (req, res) => {
  try {
    const { idMovCompra } = req.params;
    
    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      IdProducto,
      PrecioUnitario,
      ToneladasCompradas,
      FechaCompra,
      Descripcion,
      Estado,
      idUsuario,
    } = req.body;

    // Verificar que el ID esté presente
    if (!idMovCompra) {
      return res.status(400).json({
        message: "ID de compra requerido"
      });
    }

    // Verificar campos obligatorios para el cálculo
    if (!PrecioUnitario || !ToneladasCompradas) {
      return res.status(400).json({
        message: "PrecioUnitario y ToneladasCompradas son obligatorios para calcular el total"
      });
    }

    // CALCULAR TOTAL COMPRA = PrecioUnitario * ToneladasCompradas
    const totalCompra = Number(PrecioUnitario) * Number(ToneladasCompradas);

    // Actualizar en la base de datos
    const actualizar = `UPDATE movCompras SET 
      IdOperacion = ?, IdPersona = ?, IdProducto = ?, PrecioUnitario = ?, 
      ToneladasCompradas = ?, TotalCompra = ?, FechaCompra = ?, 
      Descripcion = ?, Estado = ?, idUsuario = ? 
      WHERE idMovCompra = ?`;

    db.query(
      actualizar,
      [IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasCompradas, totalCompra, FechaCompra, Descripcion, Estado, idUsuario, idMovCompra],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar compra:", error);
          return res.status(500).json({ message: "Error al actualizar la compra" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Compra no encontrada" });
        }

        res.status(200).json({
          message: "Compra actualizada exitosamente",
          TotalCompra: totalCompra
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
