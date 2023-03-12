//User Registration from NodesJS to MySQL for that we use this auth
const express = require("express");
const userController = require("../controllers/users");
const router = express.Router();

//here it will be like auth/register from app.js
router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/logout",userController.logout);


module.exports = router;


