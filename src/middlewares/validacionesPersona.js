import { personaSchema } from "../models/persona.schema.js";

// Middleware SIMPLE para validar datos
export const validarPersona = (req, res, next) => {
  // Solo validar la estructura con Joi
  const { error } = personaSchema.validate(req.body);

  if (error) {
    const errores = error.details.map((detail) => ({
      campo: detail.path[0],
      mensaje: detail.message,
    }));

    return res.status(400).json({
      message: "Errores de validación",
      errores,
    });
  }

  // Si está bien, continuar
  next();
};
