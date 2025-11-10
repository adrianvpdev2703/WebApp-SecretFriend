const Joi = require("joi");

const updateWishlistSchema = Joi.object({
    wishlist: Joi.string().allow("").messages({
        "string.base": "La wishlist debe ser texto",
    }),
});

const identifyParticipantSchema = Joi.object({
    participantId: Joi.number().integer().required().messages({
        "number.base": "El ID del participante debe ser un número",
        "any.required": "El ID del participante es requerido",
    }),
});

module.exports = {
    updateWishlistSchema,
    identifyParticipantSchema,
};
