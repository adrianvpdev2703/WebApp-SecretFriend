const express = require("express");
const router = express.Router();
const controller = require("../controllers/sorteo.controller");
const protect = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createSorteoSchema } = require("../validators/sorteo.schema");

router.use(protect);

router.route("/").post(validate(createSorteoSchema), controller.createSorteo).get(controller.getMySorteos);

router.route("/:id").put(validate(createSorteoSchema), controller.updateSorteo).delete(controller.deleteSorteo);

router.route("/:id/start").post(controller.startSorteo);

module.exports = router;
