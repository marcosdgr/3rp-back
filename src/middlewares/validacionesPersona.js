import { personaSchema } from "../models/persona.schema.js";

// Middleware para validar datos al crear una persona 
export const validarPersona = async (req, res, next) => {
  try {
    // Agregar idPersona para actualizaciones si existe en params
    const datosAValidar = {
      ...req.body,
      ...(req.params.idPersona && { idPersona: req.params.idPersona })
    };

    // Validar con validaciones externas (async)
    await personaSchema.validateAsync(datosAValidar);
    next();
  } catch (error) {
    const errores = error.details.map((detail) => ({
      campo: detail.path[0],
      mensaje: detail.message,
    }));

    return res.status(400).json({
      message: "Errores de validación",
      errores,
    });
  }
};
