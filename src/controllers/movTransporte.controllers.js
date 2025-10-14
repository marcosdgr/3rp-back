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
        message:
          "Faltan campos obligatorios: IdOperacion, IdPersona, idUsuario",
      });
    }

    // Insertar en la base de datos
    const crear = `INSERT INTO movTransportes 
      (IdOperacion, IdPersona, Origen, Destino, Kilometros, PrecioXKm, TotalViaje, FechaTransporte, Descripcion, NombreChofer, idUsuario, Estado) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pendiente')`;

    db.query(
      crear,
      [
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
      ],
      (error, results) => {
        if (error) {
          console.error("Error al crear transporte:", error);
          return res
            .status(500)
            .json({ message: "Error al crear el transporte" });
        }

        res.status(201).json({
          message: "Transporte creado exitosamente",
          id: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar un transporte existente
export const actualizarTransporte = (req, res) => {
  try {
    const { id } = req.params;

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
      Estado,
      idUsuario,
    } = req.body;

    // Verificar que el ID esté presente
    if (!id) {
      return res.status(400).json({
        message: "ID de transporte requerido",
      });
    }

    // Actualizar en la base de datos
    const actualizar = `UPDATE movTransportes SET 
      IdOperacion = ?, IdPersona = ?, Origen = ?, Destino = ?, 
      Kilometros = ?, PrecioXKm = ?, TotalViaje = ?, FechaTransporte = ?, 
      Descripcion = ?, NombreChofer = ?, Estado = ?, idUsuario = ? 
      WHERE idMovTransporte = ?`;

    db.query(
      actualizar,
      [
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
        Estado,
        idUsuario,
        id,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar transporte:", error);
          return res
            .status(500)
            .json({ message: "Error al actualizar el transporte" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Transporte no encontrado" });
        }

        res.status(200).json({
          message: "Transporte actualizado exitosamente",
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
