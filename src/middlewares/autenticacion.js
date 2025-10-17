// Middleware para verificar si el usuario es administrador


export const validarRol = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado. Asegúrate de usar verificarToken antes de validarRol" });
  }

  // Verificar si es administrador (acepta ambos valores)
  if (req.user.RolUsuario === "Administrador" || req.user.RolUsuario === "admin") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Acceso denegado: se requiere rol de administrador" });
};
