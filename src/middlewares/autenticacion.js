import { obtenerUsuarioLogueado } from "../controllers/auth.controllers.js";

// Middleware para verificar si hay usuario logueado
export const validarLogueado = (req, res, next) => {
  // Obtener usuario de la memoria
  const usuarioLogueado = obtenerUsuarioLogueado();

  // Verificar si hay usuario logueado
  if (!usuarioLogueado) {
    return res.status(401).json({ message: "Debe iniciar sesión primero" });
  }
  // Agregar usuario al req para usarlo en controladores
  req.user = usuarioLogueado;
  return next();
};

// Middleware para verificar si el usuario es administrador

export const validarRol = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  // Verificar si es administrador
  if (req.user.RolUsuario === "Administrador") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Acceso denegado: se requiere rol de administrador" });
};
