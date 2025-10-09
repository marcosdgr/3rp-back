import db from "../config/db.js";

export const crearTransporte = (req, res) => {
  try {
    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      Origen,
      Destino,
      Kilometros,
      PrecioXKm,
      TotalViaje,
      FechaTransporte,
      Descripcion,
      NombreChofer,
      idUsuario,
    } = req.body;

    // Verificar campos obligatorios
    if (!IdOperacion || !IdPersona || !idUsuario) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: IdOperacion, IdPersona, idUsuario"
      });
    }

    // Insertar en la base de datos
    const sql = `INSERT INTO movTransportes 
      (IdOperacion, IdPersona, Origen, Destino, Kilometros, PrecioXKm, TotalViaje, FechaTransporte, Descripcion, NombreChofer, idUsuario, Estado) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pendiente')`;

    db.query(
      sql,
      [IdOperacion, IdPersona, Origen, Destino, Kilometros, PrecioXKm, TotalViaje, FechaTransporte, Descripcion, NombreChofer, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear transporte:", error);
          return res.status(500).json({ message: "Error al crear el transporte" });
        }

        res.status(201).json({
          message: "Transporte creado exitosamente",
          id: results.insertId
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
