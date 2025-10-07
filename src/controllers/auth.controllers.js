import db from "../config/db.js";

// Variable simple para guardar el usuario logueado (EN MEMORIA)
let usuarioLogueado = null;

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

    // 6. Guardar usuario en memoria 
    usuarioLogueado = {
      idUsuario: user.idUsuario,
      RolUsuario: user.RolUsuario
    };

    // 7. Respuesta
    res.status(200).json({
      message: "Login exitoso",
      usuario: {
        id: user.idUsuario,
        rol: user.RolUsuario
      }
    });
  });
};

// Función para obtener el usuario logueado
export const obtenerUsuarioLogueado = () => {
  return usuarioLogueado;
};

// Función para logout
export const logoutUsuario = (req, res) => {
  usuarioLogueado = null;
  res.status(200).json({ message: "Logout exitoso" });
};
