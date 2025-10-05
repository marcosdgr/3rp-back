export const validarRol = (req, res, next) => {
  const role = req.user?.RolUsuario || req.user?.rol || req.user?.role;

  if (role === "Administrador") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Acceso denegado: se requiere rol de administrador" });
};
