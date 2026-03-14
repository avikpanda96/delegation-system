const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", auth, authController.me); 

module.exports = router;