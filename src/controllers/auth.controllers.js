import db from "../config/db.js";
import bcrypt from "bcryptjs";

let usuarioLogueado = null;

// ==============================
// 🔐 LOGIN CON BCRYPT
// ==============================
export const loginUsuario = async (req, res) => {
  const { MailUsuario, PasswordUsuario } = req.body;

  if (!MailUsuario || !PasswordUsuario) {
    return res.status(400).json({ message: "El email y la contraseña son requeridos" });
  }

  const sql = `
    SELECT idUsuario, RolUsuario, PasswordUsuario, IsActive
    FROM usuarios
    WHERE MailUsuario = ?
    LIMIT 1
  `;

  db.query(sql, [MailUsuario], async (error, results) => {
    if (error) {
      console.error("Error al buscar usuario:", error);
      return res.status(500).json({ message: "Error al buscar usuario" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = results[0];

    if (user.IsActive !== 1) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    // 🔹 Comparar contraseñas con bcrypt
    const esValida = await bcrypt.compare(PasswordUsuario, user.PasswordUsuario);
    if (!esValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Guardar usuario en memoria
    usuarioLogueado = {
      idUsuario: user.idUsuario,
      RolUsuario: user.RolUsuario,
    };

    return res.status(200).json({
      message: "Login exitoso",
      usuario: usuarioLogueado,
    });
  });
};

// Obtener usuario logueado
export const obtenerUsuarioLogueado = () => usuarioLogueado;

// Logout
export const logoutUsuario = (req, res) => {
  usuarioLogueado = null;
  res.status(200).json({ message: "Logout exitoso" });
};
