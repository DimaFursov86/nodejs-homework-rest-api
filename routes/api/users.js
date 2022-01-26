const express = require("express");
const {authenticate, upload} = require("../../middlewares");
const ctrl = require('../../controllers/users')
const router = express.Router();

router.post("/signup", ctrl.signup);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.avatars);

router.post("/login", ctrl.login);

router.get("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/verify", ctrl.verify)

router.get("/verify/:verificationToken", ctrl.getVerifyToken)

module.exports = router;