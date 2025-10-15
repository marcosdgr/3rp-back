import db from "../config/db.js";

export const crearTransporte = (req, res) => {
  try {
    const {
      IdOperacion,
      IdPersona,
      Origen,
      Destino,
      DescargasToneladas,
      Kilometros,
      FechaTransporte,
      Descripcion,
      NombreChofer,
      idUsuario,
    } = req.body;

    if (
      !IdOperacion ||
      !IdPersona ||
      !idUsuario ||
      !Kilometros ||
      !DescargasToneladas ||
      !Origen ||
      !Destino
    ) {
      return res.status(400).json({
        message: "Faltan campos obligatorios",
      });
    }

    const fechaBase = FechaTransporte ? new Date(FechaTransporte) : new Date();

    // 1) Buscar precio vigente por KM exacto
    const sqlPrecio = `
      SELECT PrecioXKm
      FROM tarifasKm
      WHERE IsActive = 1
        AND Km = ?
        AND VigenteDesde <= DATE(?)
      ORDER BY VigenteDesde DESC
      LIMIT 1
    `;

    db.query(sqlPrecio, [Kilometros, fechaBase], (err, rows) => {
      if (err) {
        console.error("Error al buscar tarifa:", err);
        return res.status(500).json({ message: "Error al buscar tarifa" });
      }
      if (!rows || rows.length === 0) {
        return res.status(400).json({
          message:
            "No existe tarifa para esos kilómetros y fecha de vigencia.",
        });
      }

      const precioXKm = Number(rows[0].PrecioXKm);

      // CALCULAR TOTAL VIAJE 
      const totalViaje = precioXKm * DescargasToneladas;

      // 2) Insertar
      const sqlInsert = `
        INSERT INTO movTransportes
        (IdOperacion, IdPersona, Origen, Destino, DescargasToneladas, Kilometros, PrecioXKm, TotalViaje,
         FechaTransporte, Descripcion, NombreChofer, idUsuario, Estado)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'Pendiente')
      `;

      db.query(
        sqlInsert,
        [
          IdOperacion,
          IdPersona,
          Origen,
          Destino,
          DescargasToneladas,
          Kilometros,
          precioXKm, // viene de tarifasKm
          totalViaje, // PrecioXKm * DescargasToneladas
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

          return res.status(201).json({
            message: "Transporte creado exitosamente",
            id: results.insertId,
            Kilometros,
            PrecioXKm: precioXKm,
            TotalViaje: totalViaje,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar un transporte existente
export const actualizarTransporte = (req, res) => {
  try {
    const { idMovTransporte } = req.params;

    // Traer todos los datos del body
    const {
      IdOperacion,
      IdPersona,
      Origen,
      Destino,
      DescargasToneladas,
      Kilometros,
      FechaTransporte,
      Descripcion,
      NombreChofer,
      Estado,
      idUsuario,
    } = req.body;

    // Verificar que el ID esté presente
    if (!idMovTransporte) {
      return res.status(400).json({
        message: "ID de transporte requerido",
      });
    }

    if (!IdOperacion || !IdPersona || !idUsuario || !Kilometros || !DescargasToneladas || !Origen || !Destino ) {
      return res.status(400).json({
        message: "Faltan campos obligatorios",
      });
    }

    const fechaBase = FechaTransporte ? new Date(FechaTransporte) : new Date();

    // Buscar precio vigente por KM exacto (igual que en crear)
    const sqlPrecio = `
      SELECT PrecioXKm
      FROM tarifasKm
      WHERE IsActive = 1
        AND Km = ?
        AND VigenteDesde <= DATE(?)
      ORDER BY VigenteDesde DESC
      LIMIT 1
    `;

    db.query(sqlPrecio, [Kilometros, fechaBase], (err, rows) => {
      if (err) {
        console.error("Error al buscar tarifa:", err);
        return res.status(500).json({ message: "Error al buscar tarifa" });
      }
      if (!rows || rows.length === 0) {
        return res.status(400).json({
          message: "No existe tarifa para esos kilómetros y fecha de vigencia. Verificá tarifasKm.",
        });
      }

      const precioXKm = Number(rows[0].PrecioXKm);
      
      // CALCULAR TOTAL VIAJE = PrecioXKm * DescargasToneladas
      const totalViaje = precioXKm * DescargasToneladas;

      // Actualizar en la base de datos
      const actualizar = `UPDATE movTransportes SET 
        IdOperacion = ?, IdPersona = ?, Origen = ?, Destino = ?, DescargasToneladas = ?,
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
          DescargasToneladas,
          Kilometros,
          precioXKm,          // del resultado de la consulta
          totalViaje,         // calculado automáticamente
          FechaTransporte,
          Descripcion,
          NombreChofer,
          Estado,
          idUsuario,
          idMovTransporte,    // corregido el nombre del parámetro
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
          TotalViaje: totalViaje,
          PrecioXKm: precioXKm
        });
      }
    );
    }); 
    
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
