import db from "../config/db.js";

export const cuentaCorrienteProductor = (req, res) => {
  try {
    const idPersona = Number(req.params.idPersona);
    if (!idPersona)
      return res.status(400).json({ message: "idPersona inválido" });

    // 1) Compras 
    const sqlCompras = `
    SELECT 
      DATE_FORMAT(COALESCE(FechaCompra, FechaRegistro), '%Y-%m-%d') AS Fecha,
      TotalCompra AS Compra,
      idMovCompra
    FROM movCompras
    WHERE IdPersona = ?
  `;

    db.query(sqlCompras, [idPersona], (errC, compras) => {
      if (errC) {
        console.error("Error al buscar compras:", errC);
        return res.status(500).json({ message: "Error al buscar compras" });
      }

      // 2) Pagos 
      const sqlPagos = `
      SELECT
        DATE_FORMAT(COALESCE(FechaMov, FechaRegistro), '%Y-%m-%d') AS Fecha,
        MontoMov AS Pagos,
        idMovFinanciero
      FROM movFinancieros
      WHERE IdPersona = ? AND TipoMov = 'Pago'
    `;

      db.query(sqlPagos, [idPersona], (errP, pagos) => {
        if (errP) {
          console.error("Error al buscar pagos:", errP);
          return res.status(500).json({ message: "Error al buscar pagos" });
        }

        // 3) Unificar formato
        const movimientosCompra = (compras || []).map((r) => ({
          Fecha: r.Fecha, // string 'YYYY-MM-DD'
          Tipo: "Operación",
          Compra: Number(r.Compra || 0),
          Pagos: 0,
          _orden: `C${String(r.idMovCompra || 0).padStart(10, "0")}`,
        }));

        const movimientosPago = (pagos || []).map((r) => ({
          Fecha: r.Fecha, // string 'YYYY-MM-DD'
          Tipo: "Pago",
          Compra: 0,
          Pagos: Number(r.Pagos || 0),
          _orden: `P${String(r.idMovFinanciero || 0).padStart(10, "0")}`,
        }));

        let movimientos = [...movimientosCompra, ...movimientosPago];

        // 4) Orden
        movimientos.sort((a, b) => {
          if (a.Fecha !== b.Fecha) return a.Fecha < b.Fecha ? -1 : 1; // ya es YYYY-MM-DD
          return a._orden < b._orden ? -1 : a._orden > b._orden ? 1 : 0;
        });

        // 5) Saldo corrido
        let saldo = 0;
        movimientos = movimientos.map((m) => {
          if (m.Compra > 0) saldo += m.Compra;
          else if (m.Pagos > 0) saldo -= m.Pagos;

          return {
            Fecha: m.Fecha,
            Tipo: m.Tipo,
            Compra: m.Compra,
            Pagos: m.Pagos,
            Evolucion: Number(saldo.toFixed(2)),
          };
        });

        // 6) Respuesta
        return res.status(200).json(movimientos);
      });
    });
  } catch (error) {
    console.error("error del servidor: ", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
