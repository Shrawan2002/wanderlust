const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const passport = require("passport");
// const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/userController.js");
const authMiddleware = require('../middlewares/auth.js')

router.post("/signup", wrapAsync(userController.signup));


// login
router.post("/login", userController.login);

//me
router.get('/me', authMiddleware, userController.me);

// // logout route
// router.get("/logout",userController.logout);


// router.get("/me", userController.curLoggedIn);

module.exports = router;