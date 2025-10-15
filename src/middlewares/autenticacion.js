import { obtenerUsuarioLogueado } from "../controllers/auth.controllers.js";

export const validarLogueado = (req, res, next) => {
  const usuarioLogueado = obtenerUsuarioLogueado();
  if (!usuarioLogueado) {
    return res.status(401).json({ message: "Debe iniciar sesión primero" });
  }
  req.user = usuarioLogueado;
  next();
};

export const validarRol = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Usuario no autenticado" });
  if (req.user.RolUsuario === "Administrador") return next();
  return res.status(403).json({ message: "Acceso denegado: se requiere rol de administrador" });
};
