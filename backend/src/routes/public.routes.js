const express = require("express");
const router = express.Router();
const controller = require("../controllers/public.controller");
const validate = require("../middlewares/validate.middleware");
const { updateWishlistSchema, identifyParticipantSchema } = require("../validators/public.schema");

router
    .route("/sorteo/:accessHash")
    .get(controller.getSorteoInfo) // GET .../public/sorteo/hash1
    .post(validate(identifyParticipantSchema), controller.identifyParticipant); // POST .../public/sorteo/hash1

router
    .route("/bolillo/:personalHash")
    .get(controller.getBolillo) // GET .../public/bolillo/hash2
    .put(validate(updateWishlistSchema), controller.updateWishlist); // PUT .../public/bolillo/hash2

module.exports = router;
