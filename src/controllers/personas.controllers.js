import db from "../config/db.js";

// traer todas las personas

export const traerPersonas = async (req, res) => {
  try {
    const traerTodasLasPersonas = `SELECT * FROM PERSONAS`;
    db.query(traerTodasLasPersonas, (error, results) => {
      if (error) {
        console.error("Error al traer personas: ", error);
        res.status(500).json({ message: "Error al traer personas" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// traer personas activas
export const traerPersonasActivas = async (req, res) => {
  try {
    const traerPersonasActivas = `SELECT * FROM PERSONAS WHERE IsActive = 1`;
    db.query(traerPersonasActivas, (error, results) => {
      if (error) {
        console.error("Error al traer personas activas: ", error);
        res.status(500).json({ message: "Error al traer personas activas" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};
// traer personas activas por tipo
export const traerPersonasActivasPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;

    const query = `SELECT * 
      FROM personas 
      WHERE IsActive = 1 AND TipoPersona = ?`;
    db.query(query, [tipo], (error, results) => {
      if (error) {
        console.error("Error al traer personas activas por tipo:", error);
        return res
          .status(500)
          .json({ message: "Error al traer personas por tipo" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// crear una nueva persona
export const crearPersona = async (req, res) => {
  try {
    // traigo todos los datos del body
    const {
      TipoPersona,
      NombrePersona,
      ApellidoPersona,
      DNI,
      MailPersona,
      TelefonoPersona,
      Ubicacion,
    } = req.body;

    // Usar el ID del usuario logueado 
    const idUsuarioCreador = req.user?.idUsuario;

    // Verificar que tenemos un usuario válido
    if (!idUsuarioCreador) {
      return res.status(400).json({
        message: "Error: No se pudo obtener el ID del usuario logueado",
      });
    }

    // Proceder directamente a insertar
    const nuevaPersona = `INSERT INTO PERSONAS (TipoPersona, NombrePersona, ApellidoPersona, DNI, MailPersona, TelefonoPersona, Ubicacion, idUsuarioCreador) VALUES (?,?,?,?,?,?,?,?)`;

    db.query(
      nuevaPersona,
      [
        TipoPersona,
        NombrePersona,
        ApellidoPersona,
        DNI,
        MailPersona,
        TelefonoPersona,
        Ubicacion,
        idUsuarioCreador,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al crear persona:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);

          // Manejo SIMPLE de errores comunes
          if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("DNI")) {
              return res
                .status(400)
                .json({ message: "El DNI ya está registrado" });
            }
            if (error.message.includes("MailPersona")) {
              return res
                .status(400)
                .json({ message: "El email ya está registrado" });
            }
            if (error.message.includes("TelefonoPersona")) {
              return res
                .status(400)
                .json({ message: "El teléfono ya está registrado" });
            }
            return res
              .status(400)
              .json({ message: "Los datos ya están registrados" });
          }

          return res.status(500).json({
            message: "Error al crear persona",
            error: error.message,
            code: error.code,
          });
        }

        res.status(201).json({
          message: "Persona creada exitosamente",
          idInsertado: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// actualizar una persona existente

export const actualizarPersona = async (req, res) => {
  try {
    const { idPersona } = req.params;
    const {
      TipoPersona,
      NombrePersona,
      ApellidoPersona,
      DNI,
      MailPersona,
      TelefonoPersona,
      Ubicacion,
    } = req.body;

    const actualizarPersona = `UPDATE PERSONAS SET TipoPersona = ?, NombrePersona = ?, ApellidoPersona = ?, DNI = ?, MailPersona = ?, TelefonoPersona = ?, Ubicacion = ? WHERE idPersona = ?`;
    db.query(
      actualizarPersona,
      [
        TipoPersona,
        NombrePersona,
        ApellidoPersona,
        DNI,
        MailPersona,
        TelefonoPersona,
        Ubicacion,
        idPersona,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar persona:", error);

          // Manejo SIMPLE de errores comunes para actualización
          if (error.code === "ER_DUP_ENTRY") {
            if (error.message.includes("DNI")) {
              return res.status(400).json({
                message: "El DNI ya está registrado por otra persona",
              });
            }
            if (error.message.includes("MailPersona")) {
              return res.status(400).json({
                message: "El email ya está registrado por otra persona",
              });
            }
            if (error.message.includes("TelefonoPersona")) {
              return res.status(400).json({
                message: "El teléfono ya está registrado por otra persona",
              });
            }
            return res.status(400).json({
              message: "Los datos ya están registrados por otra persona",
            });
          }

          return res
            .status(500)
            .json({ message: "Error al actualizar persona" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.status(200).json({ message: "Persona actualizada exitosamente" });
      }
    );
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// borrado logico de una persona
export const borradoLogicoPersona = async (req, res) => {
  try {
    const { idPersona } = req.params;
    const borradoLogico = `UPDATE PERSONAS SET IsActive = 0 WHERE idPersona = ?`;
    db.query(borradoLogico, [idPersona], (error, results) => {
      if (error) {
        console.error("Error al eliminar persona: ", error);
        return res.status(500).json({ message: "Error al eliminar persona" });
      }
    });
    res.status(200).json({ message: "Persona eliminada exitosamente" });
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
