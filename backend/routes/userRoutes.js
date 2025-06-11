const express = require('express');

const { body } = require("express-validator")

const { registerUser, loginUser, getMyProfile, updateProfile, getAllUsers, getAllAdmins } = require("../controllers/userController")
const { authMiddleware } = require("../middlewares/auth");
const { isAdmin } = require('../middlewares/role');

const router = express.Router();


router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required")
], registerUser);

router.post(
    "/login", [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required")
    ], loginUser)


router.get("/me", authMiddleware, getMyProfile);

router.put(
    "/update",
    authMiddleware, [
        body("name").optional().notEmpty(),
        body("email").optional().isEmail(),
        body("password").optional().isLength({ min: 6 }),
        body("role").optional().notEmpty()
    ],
    updateProfile
);


router.get("/allUser", authMiddleware, getAllUsers);
router.get("/allAdmin", authMiddleware, isAdmin, getAllAdmins);





module.exports = router;