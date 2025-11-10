const validate = schema => (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: "No se envió cuerpo (body) en la petición" });
    }

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: "Datos de entrada invalidos",
            details: error.details[0].message,
        });
    }

    next();
};

module.exports = validate;
