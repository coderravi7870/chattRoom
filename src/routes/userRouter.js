const express = require("express");
const userRoute = express.Router();
const multer = require("multer");
const upload = multer({ dest: "avatar/" });

const userController = require("../controllers/userController");
const middleware = require("../middlewares/authMiddleware");

userRoute.post("/signup", userController.userSignUp);
userRoute.post("/login", userController.userLogIn);
userRoute.put("/update-avatar",upload.single("avatar"),middleware.verifyToken,userController.updateAvatar);
userRoute.get("/getuser",middleware.verifyToken,userController.getUser);
userRoute.post("/logout",middleware.verifyToken,userController.logoutUser);

module.exports = userRoute;