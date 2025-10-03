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

    const nuevaPersona = `INSERT INTO PERSONAS (TipoPersona, NombrePersona, ApellidoPersona, DNI, MailPersona, TelefonoPersona, Ubicacion) VALUES (?,?,?,?,?,?,?)`;

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
      ],
      (error, results) => {
        if (error) {
          console.error("Error al crear persona: ", error);
          res.status(500).json({ message: "Error al crear persona" });
        }
        res.status(201).json({
          message: "Persona creada exitosamente",
          idInsertado: results.insertId,
        });
      }
    );
  } catch (error) {
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
          console.error("Error al actualizar persona: ", error);
          res.status(500).json({ message: "Error al actualizar persona" });
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
