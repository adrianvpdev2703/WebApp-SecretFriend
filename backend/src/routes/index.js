const express = require("express");
const router = express.Router();

const authRouter = require("./auth.routes");
const sorteoRouter = require("./sorteo.routes");
const publicRouter = require("./public.routes");

router.use("/auth", authRouter);
router.use("/sorteos", sorteoRouter);
router.use("/public", publicRouter);

module.exports = router;
