
import db from "../config/db.js";

export const crearVenta = (req, res) => {
  try {
    // Verificar que req.body exista
    if (!req.body) {
      return res.status(400).json({
        message: "Body de la petición vacío. Verificá que estés enviando Content-Type: application/json"
      });
    }

    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      IdProducto,
      PrecioUnitario,
      ToneladasVendidas,
      FechaVenta,
      Descripcion,
      idUsuario
    } = req.body;

    // Verificar campos obligatorios
    if (!IdOperacion || !IdPersona || !IdProducto || !idUsuario || !PrecioUnitario || !ToneladasVendidas) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasVendidas, idUsuario"
      });
    }

    // CALCULAR TOTAL VENTA = PrecioUnitario * ToneladasVendidas
    const totalVenta = Number(PrecioUnitario) * Number(ToneladasVendidas);

    // Insertar en la base de datos con Estado = 'Pendiente' por defecto
    const crear = `INSERT INTO movVentas 
      (IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasVendidas, TotalVenta, FechaVenta, Descripcion, idUsuario, Estado) 
      VALUES (?,?,?,?,?,?,?,?,?,'Pendiente')`;

    db.query(
      crear,
      [IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasVendidas, totalVenta, FechaVenta, Descripcion, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear venta:", error);
          return res.status(500).json({ message: "Error al crear la venta" });
        }

        res.status(201).json({
          message: "Venta creada exitosamente",
          id: results.insertId,
          TotalVenta: totalVenta
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar una venta existente
export const actualizarVenta = (req, res) => {
  try {
    const { idMovVenta } = req.params;
    
    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      IdProducto,
      PrecioUnitario,
      ToneladasVendidas,
      FechaVenta,
      Descripcion,
      Estado,
      idUsuario,
    } = req.body;

    // Verificar que el ID esté presente
    if (!idMovVenta) {
      return res.status(400).json({
        message: "ID de venta requerido"
      });
    }

    // Verificar campos obligatorios para el cálculo
    if (!PrecioUnitario || !ToneladasVendidas) {
      return res.status(400).json({
        message: "PrecioUnitario y ToneladasVendidas son obligatorios para calcular el total"
      });
    }

    // CALCULAR TOTAL VENTA = PrecioUnitario * ToneladasVendidas
    const totalVenta = Number(PrecioUnitario) * Number(ToneladasVendidas);

    // Actualizar en la base de datos
    const actualizar = `UPDATE movVentas SET 
      IdOperacion = ?, IdPersona = ?, IdProducto = ?, PrecioUnitario = ?, 
      ToneladasVendidas = ?, TotalVenta = ?, FechaVenta = ?, 
      Descripcion = ?, Estado = ?, idUsuario = ? 
      WHERE idMovVenta = ?`;

    db.query(
      actualizar,
      [IdOperacion, IdPersona, IdProducto, PrecioUnitario, ToneladasVendidas, totalVenta, FechaVenta, Descripcion, Estado, idUsuario, idMovVenta],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar venta:", error);
          return res.status(500).json({ message: "Error al actualizar la venta" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.status(200).json({
          message: "Venta actualizada exitosamente",
          TotalVenta: totalVenta
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener una venta por su ID
export const traerVentaPorId = (req, res) => {
  const { idMovVenta } = req.params;

  if (!idMovVenta) {
    return res.status(400).json({ message: "ID de venta requerido" });
  }

  const query = `SELECT * FROM movVentas WHERE idMovVenta = ?`;

  db.query(query, [idMovVenta], (error, results) => {
    if (error) {
      console.error("Error al obtener la venta:", error);
      return res.status(500).json({ message: "Error al obtener la venta" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.status(200).json(results[0]);
  });
};
