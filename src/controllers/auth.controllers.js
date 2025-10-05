// controllers/authController.js
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const loginUsuario = (req, res) => {
  const { MailUsuario, PasswordUsuario } = req.body;

  // 1. Validar campos
  if (!MailUsuario || !PasswordUsuario) {
    return res
      .status(400)
      .json({ message: "El email y la contraseña son requeridos" });
  }

  // 2. Buscar usuario en la base
  const sql = `
    SELECT idUsuario, RolUsuario, PasswordUsuario, IsActive
    FROM usuarios
    WHERE MailUsuario = ?
    LIMIT 1
  `;

  db.query(sql, [MailUsuario], (error, results) => {
    if (error) {
      console.error("Error al buscar usuario:", error);
      return res.status(500).json({ message: "Error al buscar usuario" });
    }

    // 3. No existe
    if (!results || results.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = results[0];

    // 4. Usuario inactivo
    if (user.IsActive !== 1) {
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    // 5. Comparar password 
    if (user.PasswordUsuario !== PasswordUsuario) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 6. Crear el token
    const payload = {
      idUsuario: user.idUsuario,
      rol: user.RolUsuario,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // 7. Respuesta
    res.status(200).json({
      message: "Login exitoso",
      token,
    });
  });
};
