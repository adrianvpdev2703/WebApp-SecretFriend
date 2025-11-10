const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

const { registerSchema, loginSchema } = require("../validators/auth.schema");

const validate = require("../middlewares/validate.middleware");

// GET /api/auth/test
router.get("/test", (req, res) => {
    res.json({ message: "Auth route is working!" });
});

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
