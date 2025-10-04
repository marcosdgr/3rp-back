import { personaSchema } from "../models/persona.schema.js";

// Middleware para validar datos al crear una persona
export const validarPersona = (req, res, next) => {
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

  next();
};
