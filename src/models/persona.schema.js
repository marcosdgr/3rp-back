import Joi from "joi";

// Schema para validar los datos de una persona
export const personaSchema = Joi.object({
  TipoPersona: Joi.string()
    .trim()
    .valid("Cliente", "Productor", "Tranportista")
    .required()
    .messages({
      "any.only":
        "TipoPersona debe ser uno de: Cliente, Productor,  Tranportista",
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
});

// Schema para actualizar una persona (todos los campos opcionales)
// export const actualizarPersonaSchema = Joi.object({
//   TipoPersona: Joi.string()
//     .trim()
//     .valid("Cliente", "Proveedor", "Empleado", "Administrador")
//     .messages({
//       "string.base": "TipoPersona debe ser una cadena de texto",
//       "any.only":
//         "TipoPersona debe ser uno de: Cliente, Proveedor, Empleado, Administrador",
//     }),

//   NombrePersona: Joi.string()
//     .trim()
//     .min(2)
//     .max(50)
//     .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
//     .messages({
//       "string.min": "El nombre debe tener al menos 2 caracteres",
//       "string.max": "El nombre  no puede exceder 50 caracteres",
//       "string.pattern.base": "El nombre  solo puede contener letras",
//     }),

//   ApellidoPersona: Joi.string()
//     .trim()
//     .min(2)
//     .max(50)
//     .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
//     .messages({
//       "string.min": "El apellido  debe tener al menos 2 caracteres",
//       "string.max": "El apellido  no puede exceder 50 caracteres",
//       "string.pattern.base":
//         "El apellido  solo puede contener letras y espacios",
//     }),

//   DNI: Joi.string()
//     .trim()
//     .pattern(/^\d{7,8}$/)
//     .messages({
//       "string.pattern.base": "DNI debe contener entre 7 y 8 dígitos",
//     }),

//   MailPersona: Joi.string().trim().email().max(100).messages({
//     "string.email": "Debe ser un email válido",
//     "string.max": "El mail no puede exceder 100 caracteres",
//   }),

//   TelefonoPersona: Joi.string()
//     .trim()
//     .pattern(/^[\d\-\+\(\)\s]+$/)
//     .min(8)
//     .max(20)
//     .messages({
//       "string.pattern.base":
//         "El telefono debe contener solo números, espacios, guiones, + y paréntesis",
//       "string.min": "El telefono debe tener al menos 8 caracteres",
//       "string.max": "El telefono no puede exceder 20 caracteres",
//     }),

//   Ubicacion: Joi.string().trim().min(2).max(100).messages({
//     "string.min": "Ubicacion debe tener al menos 2 caracteres",
//     "string.max": "Ubicacion no puede exceder 100 caracteres",
//   }),
// });

// // Función para validar los datos de una persona
// export const validarPersona = (data) => {
//   return personaSchema.validate(data, {
//     abortEarly: false, // Retorna todos los errores, no solo el primero
//     allowUnknown: false, // No permite campos adicionales
//   });
// };

// // Función para validar datos de actualización de persona
// export const validarActualizacionPersona = (data) => {
//   return actualizarPersonaSchema.validate(data, {
//     abortEarly: false,
//     allowUnknown: false,
//   });
// };
