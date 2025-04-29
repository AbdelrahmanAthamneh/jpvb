const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateChangePassword,
} = require("../middlewares/validation");

router.post("/register", validateRegister, authController.register);

router.post("/login", validateLogin, authController.login);

router.get("/validate", (req, res) => {
  res.json({ valid: true, user: req.user });
});

router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/change-password",
  validateChangePassword,
  authController.changePassword
);

module.exports = router;
