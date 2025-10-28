import db from "../config/db.js";

export const cuentaCorrienteProductor = (req, res) => {
  try {
    const idPersona = Number(req.params.idPersona);
    if (!idPersona) {
      return res.status(400).json({ message: "idPersona inválido" });
    }

    // operaciones + pagos + movimientos cuenta corriente
    const sql = `
      -- Operaciones (compras)
      SELECT 
        DATE_FORMAT(COALESCE(FechaCompra, FechaRegistro), '%Y-%m-%d') AS Fecha,
        'Operacion' AS Tipo,
        TotalCompra AS Monto,
        'C' AS Origen,
        idMovCompra AS Id
      FROM movCompras
      WHERE IdPersona = ?
      
      UNION ALL
      
      -- Pagos
      SELECT
        DATE_FORMAT(COALESCE(FechaMov, FechaRegistro), '%Y-%m-%d') AS Fecha,
        'Pago' AS Tipo,
        MontoMov AS Monto,
        'P' AS Origen,
        idMovFinanciero AS Id
      FROM movFinancieros
      WHERE IdPersona = ? AND TipoMov = 'Pago'
      
      UNION ALL
      
      -- Movimientos cuenta corriente 
      SELECT
        DATE_FORMAT(COALESCE(cm.FechaMov, cm.FechaRegistro), '%Y-%m-%d') AS Fecha,
        CASE 
          WHEN cm.TipoMov = 'Debe' THEN 'Operacion'
          WHEN cm.TipoMov = 'Haber' THEN 'Pago'
        END AS Tipo,
        cm.Monto,
        'CC' AS Origen,
        cm.idCtaCteMov AS Id
      FROM ctactes cc
      INNER JOIN ctacteMovimientos cm ON cc.idCtaCte = cm.IdCtaCte
      WHERE cc.IdPersona = ? AND cc.IsActive = 1
      
      ORDER BY Fecha ASC, Origen ASC, Id ASC
    `;

    db.query(sql, [idPersona, idPersona, idPersona], (error, results) => {
      if (error) {
        console.error("Error al buscar cuenta corriente:", error);
        return res.status(500).json({ message: "Error al buscar cuenta corriente" });
      }

      if (!results || results.length === 0) {
        return res.status(200).json([]);
      }

      // Procesar y calcular evolución
      let evolucion = 0;
      const movimientos = results.map(mov => {
        const compra = mov.Tipo === 'Operacion' ? Number(mov.Monto || 0) : 0;
        const pago = mov.Tipo === 'Pago' ? Number(mov.Monto || 0) : 0;
        
        evolucion += compra - pago;
        
        return {
          Fecha: mov.Fecha,
          Tipo: mov.Tipo,
          Compra: compra,
          Pago: pago,
          Evolucion: Number(evolucion.toFixed(2))
        };
      });

      return res.status(200).json(movimientos);
    });

  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
