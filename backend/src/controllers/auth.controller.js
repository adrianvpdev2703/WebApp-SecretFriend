const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await db.User.findOne({
            where: { [Op.or]: [{ email }, { username }] },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Username o Email ya estan registrados" });
        }

        const newUser = await db.User.create({
            username,
            email,
            password,
        });

        const payload = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el usuario :(" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al procesar el login" });
    }
};
