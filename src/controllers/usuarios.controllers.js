import db from "../config/db.js";

export const traerUsuarios = async (req, res) => {
  try {
    const traerTodasLosUsuarios = `SELECT * FROM USUARIOS`;
    db.query(traerTodasLosUsuarios, (error, results) => {
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

export const borradoLogicoUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const borrarUsuario = `UPDATE USUARIOS SET IsActive = 0 WHERE idUsuario = ?`;
    db.query(borrarUsuario, [idUsuario], (error, results) => {
      if (error) {
        console.error("Error al eliminar persona: ", error);
        return res.status(500).json({ message: "Error al eliminar usuario" });
      }
    });
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
