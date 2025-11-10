const Joi = require("joi");

const createSorteoSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "El nombre es requerido",
        "any.required": "El nombre es requerido",
    }),
    date: Joi.date().optional().allow(null, ""),
    participants: Joi.array().items(Joi.string().required()).min(2).required().messages({
        "array.min": "Se requieren al menos 2 participantes",
        "any.required": "La lista de participantes es requerida",
    }),
});

module.exports = {
    createSorteoSchema,
};
