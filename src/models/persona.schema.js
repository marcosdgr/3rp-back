import Joi from "joi";

// Schema para validar los datos de una persona
export const personaSchema = Joi.object({
  TipoPersona: Joi.string()
    .trim()
    .valid("Cliente", "Productor", "Transportista")
    .required()
    .messages({
      "any.only":
        "TipoPersona debe ser uno de: Cliente, Productor,  Transportista",
      "any.required": "TipoPersona es requerido",
    }),

  NombrePersona: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "string.max": "El nombre no puede exceder 50 caracteres",
      "string.pattern.base": "El nombre solo puede contener letras",
      "any.required": "El nombre es requerido",
    }),

  ApellidoPersona: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.min": "El apellido debe tener al menos 2 caracteres",
      "string.max": "El apellido no puede exceder 50 caracteres",
      "string.pattern.base": "El apellido solo puede contener letras",
      "any.required": "El apellido es requerido",
    }),

  DNI: Joi.string()
    .trim()
    .pattern(/^\d{7,8}$/)
    .required()
    .messages({
      "string.pattern.base": "DNI debe contener entre 7 y 8 dígitos",
      "any.required": "DNI es requerido",
    }),

  MailPersona: Joi.string().trim().email().max(100).required().messages({
    "string.email": "Debe ser un email válido",
    "string.max": "El mail no puede exceder 100 caracteres",
    "any.required": "El mail es requerido",
  }),

  TelefonoPersona: Joi.string()
    .trim()
    .pattern(/^[\d\-\+\(\)\s]+$/)
    .min(8)
    .max(20)
    .required()
    .messages({
      "string.pattern.base":
        "El telefono debe contener solo números, espacios, guiones, + y paréntesis",
      "string.min": "El telefono debe tener al menos 8 caracteres",
      "string.max": "El telefono no puede exceder 20 caracteres",
      "any.required": "El telefono es requerido",
    }),

  Ubicacion: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Ubicacion debe tener al menos 2 caracteres",
    "string.max": "Ubicacion no puede exceder 100 caracteres",
    "any.required": "Ubicacion es requerido",
  }),

  idUsuarioCreador: Joi.number().integer().positive().optional().messages({
    "number.base": "idUsuarioCreador debe ser un número",
    "number.integer": "idUsuarioCreador debe ser un número entero",
    "number.positive": "idUsuarioCreador debe ser un número positivo"
  }),
});

