import db from "../config/db.js";

// Traer todas las cajas
export const traerCajas = async (req, res) => {
    try {
        const traerTodasLasCajas = `SELECT * FROM CAJAS`;
        db.query(traerTodasLasCajas, (error, results) => {
            if (error) {
                console.error("Error al traer cajas:", error);
                return res.status(500).json({ message: "Error al traer cajas" });
            }
            res.status(200).json(results);
        }); // 👈 faltaba este paréntesis y punto y coma
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Traer cajas activas
export const traerCajasActivas = async (req, res) => {
    try {
        const traerCajasActivas = `SELECT * FROM CAJAS WHERE IsActive = 1`;
        db.query(traerCajasActivas, (error, results) => {
            if (error) {
                console.error("Error al traer cajas activas:", error);
                return res.status(500).json({ message: "Error al traer cajas activas" });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Traer cajas activas por tipo
export const traerCajasActivasPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;

        const query = `SELECT * FROM CAJAS WHERE IsActive = 1 AND TipoCaja = ?`;
        db.query(query, [tipo], (error, results) => {
            if (error) {
                console.error("Error al traer cajas activas por tipo:", error);
                return res.status(500).json({ message: "Error al traer cajas por tipo" });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Crear una caja
export const crearCaja = async (req, res) => {
    try {
        const { tipoCaja, NombreCaja, SaldoCaja } = req.body;

        const nuevaCaja = `INSERT INTO CAJAS (TipoCaja, NombreCaja, SaldoCaja) VALUES (?,?,?)`;

        db.query(nuevaCaja, [tipoCaja, NombreCaja, SaldoCaja], (error, results) => {
            if (error) {
                console.error("Error al crear caja:", error);
                return res.status(500).json({ message: "Error al crear caja" });
            }

            res.status(201).json({
                message: "Caja creada exitosamente",
                idInsertado: results.insertId,
            });
        });
    } catch (error) {
        console.error("Error del servidor:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};
