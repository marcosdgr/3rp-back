import db from "../config/db.js";
import bcrypt from "bcrypt";

// crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    // traigo todos los datos del body
    const {
      NombreUsuario,
      ApellidoUsuario,
      DNI,
      PasswordUsuario,
      MailUsuario,
      RolUsuario
    } = req.body;
    // verificar campos obligatorios
    if (
      !NombreUsuario ||
      !ApellidoUsuario ||
      !DNI ||
      !PasswordUsuario ||
      !MailUsuario ||
      !RolUsuario
    ) {
      return res.status(400).json({
        message: "Faltan campos obligatorios",
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(PasswordUsuario, saltRounds);

    // insertar en la base de datos con contraseña hasheada
    const crear = `INSERT INTO USUARIOS (NombreUsuario, ApellidoUsuario, DNI, PasswordUsuario, MailUsuario, RolUsuario, IsActive) VALUES (?,?,?,?,?,?,1)`;
    db.query(
      crear,
      [NombreUsuario, ApellidoUsuario, DNI, hashedPassword, MailUsuario, RolUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear usuario:", error);
          return res.status(500).json({ message: "Error al crear el usuario" });
        }
        res.status(201).json({
          message: "Usuario creado exitosamente",
          id: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar usuario 

// traer todos los usuarios
export const traerUsuarios = async (req, res) => {
  try {
    const traerTodosLosUsuarios = `SELECT * FROM USUARIOS`;
    db.query(traerTodosLosUsuarios, (error, results) => {
      if (error) {
        console.error("Error al traer usuarios: ", error);
        res.status(500).json({ message: "Error al traer usuarios" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// traer usuarios activos
export const traerUsuariosActivos = async (req, res) => {
  try {
    const traerSoloActivos = `SELECT * FROM USUARIOS WHERE IsActive = 1`;
    db.query(traerSoloActivos, (error, results) => {
      if (error) {
        console.error("Error al traer usuarios activos: ", error);
        res.status(500).json({ message: "Error al traer usuarios activos" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// borrado logico de un usuario
export const borradoLogicoUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const borrarUsuario = `UPDATE USUARIOS SET IsActive = 0 WHERE idUsuario = ?`;
    db.query(borrarUsuario, [idUsuario], (error, results) => {
      if (error) {
        console.error("Error al eliminar usuario: ", error);
        return res.status(500).json({ message: "Error al eliminar usuario" });
      }
    });
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// activar usuario

export const activarUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const activar = `UPDATE USUARIOS SET IsActive = 0 WHERE idUsuario = ?`;
    db.query(activar, [idUsuario], (error, results) => {
      if (error) {
        console.error("Error al eliminar usuario: ", error);
        return res.status(500).json({ message: "Error al eliminar usuario" });
      }
    });
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
