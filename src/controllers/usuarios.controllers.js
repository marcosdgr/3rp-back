import db from "../config/db.js";




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
