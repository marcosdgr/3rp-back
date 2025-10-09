import db from "../config/db.js";

// crear una nueva operacion

export const crearOperacion = async (req, res) => {
  try {
    const {
      FechaOperacion,
      Estado = "Pendiente",
      Descripcion,
      idUsuario,
    } = req.body;

    const sql = `
            INSERT INTO operaciones (FechaOperacion, Estado, Descripcion, idUsuario)
            VALUES (?, ?, ?, ?)
        `;
    db.query(
      sql,
      [FechaOperacion, Estado, Descripcion, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear operacion:", error);
          return res.status(500).json({ message: "Error al crear operacion" });
        }
        res
          .status(201)
          .json({
            message: "Operacion creada exitosamente",
            idOperacion: results.insertId,
          });
      }
    );
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener operación completa con todos sus movimientos
export const obtenerOperacionCompleta = async (req, res) => {
  try {
    const { idOperacion } = req.params;

    // Consulta para obtener la operación base
    const sqlOperacion = `SELECT * FROM operaciones WHERE idOperacion = ?`;
    
    db.query(sqlOperacion, [idOperacion], (error, operacion) => {
      if (error) {
        console.error("Error al buscar operación:", error);
        return res.status(500).json({ message: "Error al buscar operación" });
      }

      if (operacion.length === 0) {
        return res.status(404).json({ message: "Operación no encontrada" });
      }

      // Consultas para obtener todos los movimientos asociados
      const sqlCompras = `SELECT * FROM movCompras WHERE IdOperacion = ?`;
      const sqlVentas = `SELECT * FROM movVentas WHERE IdOperacion = ?`;
      const sqlTransportes = `SELECT * FROM movTransportes WHERE IdOperacion = ?`;

      // Ejecutar consultas de movimientos
      db.query(sqlCompras, [idOperacion], (errorC, compras) => {
        db.query(sqlVentas, [idOperacion], (errorV, ventas) => {
          db.query(sqlTransportes, [idOperacion], (errorT, transportes) => {
            
            if (errorC || errorV || errorT) {
              console.error("Error al obtener movimientos:", { errorC, errorV, errorT });
              return res.status(500).json({ message: "Error al obtener movimientos" });
            }

            // Respuesta completa
            res.status(200).json({
              operacion: operacion[0],
              movimientos: {
                compras: compras || [],
                ventas: ventas || [],
                transportes: transportes || []
              },
              resumen: {
                totalCompras: compras?.length || 0,
                totalVentas: ventas?.length || 0,
                totalTransportes: transportes?.length || 0
              }
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
