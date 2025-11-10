const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const protect = (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            token = authHeader.split(" ")[1];

            const payload = jwt.verify(token, JWT_SECRET);

            req.user = {
                id: payload.id,
                email: payload.email,
                username: payload.username,
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: "Token no válido o expirado" });
        }
    } else {
        res.status(401).json({ error: "No autorizado, no hay token" });
    }
};

module.exports = protect;
