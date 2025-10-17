import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const loginUsuario = async (req, res) => {
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

  db.query(sql, [MailUsuario], async (error, results) => {
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

    // 5. Comparar password hasheada
    const passwordMatch = await bcrypt.compare(PasswordUsuario, user.PasswordUsuario);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 6. Generar token JWT
    const tokenPayload = {
      idUsuario: user.idUsuario,
      RolUsuario: user.RolUsuario,
      MailUsuario: MailUsuario
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { 
      expiresIn: '24h' // Token válido por 24 horas
    });

    // 8. Respuesta con token
    res.status(200).json({
      message: "Login exitoso",
      token: token,
      usuario: {
        id: user.idUsuario,
        rol: user.RolUsuario,
        email: MailUsuario
      }
    });
  });
};
