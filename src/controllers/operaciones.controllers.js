import db from "../config/db.js";

// crear una nueva operacion

export const crearOperacion = async (req, res) => {
  try {
  

    const {
      FechaOperacion,
      Descripcion,
      idUsuario
    } = req.body;

    // Verificar campos obligatorios
    if (!idUsuario) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: idUsuario"
      });
    }

    const crear = `
            INSERT INTO operaciones (FechaOperacion, Estado, Descripcion, idUsuario)
            VALUES (?, 'Pendiente', ?, ?)
        `;
    db.query(
      crear,
      [FechaOperacion, Descripcion, idUsuario],
      (error, results) => {
        if (error) {
          console.error("Error al crear operacion:", error);
          return res.status(500).json({ message: "Error al crear operacion" });
        }
        res.status(201).json({
          message: "Operacion creada exitosamente",
          id: results.insertId,
          Estado: 'Pendiente'
        });
      }
    );
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar una operación existente
export const actualizarOperacion = async (req, res) => {
  try {
    const { idOperacion } = req.params;

    // Verificar que req.body exista
    if (!req.body) {
      return res.status(400).json({
        message: "Body de la petición vacío. Verificá que estés enviando Content-Type: application/json"
      });
    }

    // Traer todos los datos del body
    const {
      FechaOperacion,
      Descripcion,
      Estado,
      idUsuario,
    } = req.body;

    // Verificar que el ID esté presente
    if (!idOperacion) {
      return res.status(400).json({
        message: "ID de operación requerido"
      });
    }

    // Actualizar en la base de datos
    const actualizar = `UPDATE operaciones SET 
      FechaOperacion = ?, Descripcion = ?, Estado = ?, idUsuario = ? 
      WHERE idOperacion = ?`;

    db.query(
      actualizar,
      [FechaOperacion, Descripcion, Estado, idUsuario, idOperacion],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar operación:", error);
          return res.status(500).json({ message: "Error al actualizar la operación" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Operación no encontrada" });
        }

        res.status(200).json({
          message: "Operación actualizada exitosamente"
        });
      }
    );
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener operación completa con todos sus movimientos
export const obtenerOperacionCompleta = async (req, res) => {
  try {
    const { idOperacion } = req.params;

    // Consulta para obtener la operación base
    const sqlOperacion = `SELECT * FROM operaciones WHERE idOperacion = ?`;

    db.query(sqlOperacion, [idOperacion], (error, operacion) => {
      if (error) {
        console.error("Error al buscar operación:", error);
        return res.status(500).json({ message: "Error al buscar operación" });
      }

      if (operacion.length === 0) {
        return res.status(404).json({ message: "Operación no encontrada" });
      }

      // Consultas para obtener todos los movimientos asociados
      const sqlCompras = `
        SELECT 
          mc.*,
          p.NombrePersona AS ProductorNombre,
          p.ApellidoPersona AS ProductorApellido,
          pr.NombreProducto
        FROM movCompras mc
        LEFT JOIN personas p ON mc.IdPersona = p.idPersona
        LEFT JOIN productos pr ON mc.IdProducto = pr.idProducto
        WHERE mc.IdOperacion = ?
      `;

      const sqlVentas = `
        SELECT 
          mv.*,
          p.NombrePersona AS ClienteNombre,
          p.ApellidoPersona AS ClienteApellido,
          pr.NombreProducto
        FROM movVentas mv
        LEFT JOIN personas p ON mv.IdPersona = p.idPersona
        LEFT JOIN productos pr ON mv.IdProducto = pr.idProducto
        WHERE mv.IdOperacion = ?
      `;

      const sqlTransportes = `
        SELECT 
          mt.*,
          p.NombrePersona AS TransportistaNombre,
          p.ApellidoPersona AS TransportistaApellido
        FROM movTransportes mt
        LEFT JOIN personas p ON mt.IdPersona = p.idPersona
        WHERE mt.IdOperacion = ?
      `;

      // Ejecutar consultas de movimientos
      db.query(sqlCompras, [idOperacion], (errorC, compras) => {
        db.query(sqlVentas, [idOperacion], (errorV, ventas) => {
          db.query(sqlTransportes, [idOperacion], (errorT, transportes) => {
            if (errorC || errorV || errorT) {
              console.error("Error al obtener movimientos:", {
                errorC,
                errorV,
                errorT,
              });
              return res
                .status(500)
                .json({ message: "Error al obtener movimientos" });
            }

            // Respuesta completa
            res.status(200).json({
              operacion: operacion[0],
              movimientos: {
                compras: compras || [],
                ventas: ventas || [],
                transportes: transportes || [],
              },
              resumen: {
                totalCompras: compras?.length || 0,
                totalVentas: ventas?.length || 0,
                totalTransportes: transportes?.length || 0,
              },
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener todas las operaciones
export const obtenerTodasLasOperaciones = async (req, res) => {
  try {
    const sql = `
      SELECT o.*, u.NombreUsuario, u.ApellidoUsuario 
      FROM operaciones o 
      LEFT JOIN usuarios u ON o.idUsuario = u.idUsuario 
      ORDER BY o.FechaRegistro DESC
    `;

    db.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener operaciones:", error);
        return res.status(500).json({ message: "Error al obtener operaciones" });
      }
      
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener operaciones filtradas por mes y año con todos sus movimientos
export const obtenerOperacionesFiltradas = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    console.log("Parámetros recibidos:", { mes, anio });

    if (!mes || !anio) {
      return res.status(400).json({ 
        message: "Los parámetros 'mes' y 'anio' son requeridos" 
      });
    }

    // Consulta COMPLETA con todos los JOINs necesarios
    const sqlOperaciones = `
      SELECT 
        o.idOperacion,
        o.FechaRegistro,
        o.FechaOperacion,
        o.Estado,
        o.Descripcion,
        o.idUsuario,
        u.NombreUsuario,
        u.ApellidoUsuario,
        
        -- Datos de Compras
        mc.idMovCompra,
        mc.ToneladasCompradas as CompraToneladas,
        mc.PrecioUnitario as CompraPrecio,
        mc.TotalCompra,
        mc.FechaCompra,
        mc.Descripcion as CompraDescripcion,
        mc.Estado as CompraEstado,
        pc.NombrePersona as ProductorNombre,
        pc.ApellidoPersona as ProductorApellido,
        prc.NombreProducto as ProductoCompra,
        
        -- Datos de Ventas
        mv.idMovVenta,
        mv.ToneladasVendidas as VentaToneladas,
        mv.PrecioUnitario as VentaPrecio,
        mv.TotalVenta,
        mv.FechaVenta,
        mv.Descripcion as VentaDescripcion,
        mv.Estado as VentaEstado,
        pv.NombrePersona as ClienteNombre,
        pv.ApellidoPersona as ClienteApellido,
        prv.NombreProducto as ProductoVenta,
        
        -- Datos de Transportes
        mt.idMovTransporte,
        mt.Origen,
        mt.Destino,
        mt.Kilometros,
        mt.PrecioXKm,
        mt.TotalViaje,
        mt.FechaTransporte,
        mt.Descripcion as TransporteDescripcion,
        mt.Estado as TransporteEstado,
        mt.NombreChofer,
        pt.NombrePersona as TransportistaNombre,
        pt.ApellidoPersona as TransportistaApellido
        
      FROM operaciones o
      LEFT JOIN usuarios u ON o.idUsuario = u.idUsuario
      
      -- LEFT JOIN para Compras
      LEFT JOIN movCompras mc ON o.idOperacion = mc.IdOperacion
      LEFT JOIN personas pc ON mc.IdPersona = pc.idPersona
      LEFT JOIN productos prc ON mc.IdProducto = prc.idProducto
      
      -- LEFT JOIN para Ventas
      LEFT JOIN movVentas mv ON o.idOperacion = mv.IdOperacion
      LEFT JOIN personas pv ON mv.IdPersona = pv.idPersona
      LEFT JOIN productos prv ON mv.IdProducto = prv.idProducto
      
      -- LEFT JOIN para Transportes
      LEFT JOIN movTransportes mt ON o.idOperacion = mt.IdOperacion
      LEFT JOIN personas pt ON mt.IdPersona = pt.idPersona
      
      WHERE MONTH(o.FechaOperacion) = ? AND YEAR(o.FechaOperacion) = ?
      ORDER BY o.idOperacion DESC, mc.idMovCompra, mv.idMovVenta, mt.idMovTransporte
    `;

    db.query(sqlOperaciones, [parseInt(mes), parseInt(anio)], (error, results) => {
      if (error) {
        console.error("Error en consulta de operaciones:", error);
        return res.status(500).json({ 
          message: "Error al obtener operaciones",
          error: error.message 
        });
      }

      console.log(`Resultados crudos: ${results.length} registros`);

      // Procesar los resultados para agrupar por operación
      const operacionesMap = new Map();

      results.forEach(row => {
        const idOperacion = row.idOperacion;
        
        if (!operacionesMap.has(idOperacion)) {
          // Crear estructura base de la operación
          operacionesMap.set(idOperacion, {
            idOperacion: row.idOperacion,
            FechaRegistro: row.FechaRegistro,
            FechaOperacion: row.FechaOperacion,
            Estado: row.Estado,
            Descripcion: row.Descripcion,
            idUsuario: row.idUsuario,
            NombreUsuario: row.NombreUsuario,
            ApellidoUsuario: row.ApellidoUsuario,
            compras: [],
            ventas: [],
            transportes: []
          });
        }

        const operacion = operacionesMap.get(idOperacion);

        // Agregar compra si existe y no está duplicada
        if (row.idMovCompra && !operacion.compras.find(c => c.idMovCompra === row.idMovCompra)) {
          operacion.compras.push({
            idMovCompra: row.idMovCompra,
            ToneladasCompradas: row.CompraToneladas,
            PrecioUnitario: row.CompraPrecio,
            TotalCompra: row.TotalCompra,
            FechaCompra: row.FechaCompra,
            Descripcion: row.CompraDescripcion,
            Estado: row.CompraEstado,
            ProductorNombre: row.ProductorNombre,
            ProductorApellido: row.ProductorApellido,
            ProductoNombre: row.ProductoCompra
          });
        }

        // Agregar venta si existe y no está duplicada
        if (row.idMovVenta && !operacion.ventas.find(v => v.idMovVenta === row.idMovVenta)) {
          operacion.ventas.push({
            idMovVenta: row.idMovVenta,
            ToneladasVendidas: row.VentaToneladas,
            PrecioUnitario: row.VentaPrecio,
            TotalVenta: row.TotalVenta,
            FechaVenta: row.FechaVenta,
            Descripcion: row.VentaDescripcion,
            Estado: row.VentaEstado,
            ClienteNombre: row.ClienteNombre,
            ClienteApellido: row.ClienteApellido,
            ProductoNombre: row.ProductoVenta
          });
        }

        // Agregar transporte si existe y no está duplicada
        if (row.idMovTransporte && !operacion.transportes.find(t => t.idMovTransporte === row.idMovTransporte)) {
          operacion.transportes.push({
            idMovTransporte: row.idMovTransporte,
            Origen: row.Origen,
            Destino: row.Destino,
            Kilometros: row.Kilometros,
            PrecioXKm: row.PrecioXKm,
            TotalViaje: row.TotalViaje,
            FechaTransporte: row.FechaTransporte,
            Descripcion: row.TransporteDescripcion,
            Estado: row.TransporteEstado,
            NombreChofer: row.NombreChofer,
            TransportistaNombre: row.TransportistaNombre,
            TransportistaApellido: row.TransportistaApellido
          });
        }
      });

      const operacionesCompletas = Array.from(operacionesMap.values());
      
      console.log(`Operaciones procesadas: ${operacionesCompletas.length}`);
      console.log("Primera operación procesada:", operacionesCompletas[0]);

      res.status(200).json(operacionesCompletas);
    });

  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};