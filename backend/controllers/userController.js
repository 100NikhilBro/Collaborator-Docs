const User = require('../models/User');
const { validationResult } = require('express-validator');
const { cleanInput } = require("../utils/sanitizeInput");
const { hashedPassword, verifyPaasword } = require('../utils/password');
const jwt = require('jsonwebtoken');

require('dotenv').config()



exports.registerUser = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    try {

        // const clean = cleanInput(req.body);
        const { name, email, password, role } = cleanInput(req.body);

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await hashedPassword(password);
        const newUser = new User({ name, email, role, password: hash });

        await newUser.save();

        res.status(201).json({
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            message: "User Registered Successfully",
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "User failed to register" });
    }
};




exports.loginUser = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email, password } = cleanInput(req.body);
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const registeredUser = await User.findOne({ email });
        if (!registeredUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await verifyPaasword(registeredUser.password, password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            name: registeredUser.name,
            email: registeredUser.email,
            role: registeredUser.role,
            id: registeredUser._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });

        registeredUser.password = undefined;
        const options = {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            httpOnly: true,
        };

        res.status(200).cookie('token', token, options).json({
            token,
            user: registeredUser,
            message: "User logged in successfully",
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to login" });
    }
};





exports.getMyProfile = async(req, res) => {
    try {
        console.log(req.user);
        const id = req.user.id;
        console.log(id);
        const userProfile = await User.findById(id).select('-password');
        console.log(userProfile);

        return res.status(200).json({ profile: userProfile });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to fetch profile" });
    }
};





exports.updateProfile = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const id = req.user.id;
        const { name, role, email, password } = cleanInput(req.body);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        if (password) {
            user.password = await hashedPassword(password);
        }

        await user.save();

        return res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: "User updated successfully",
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Failed to update profile" });
    }
};




exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({ role: "user" }).select('-password');
        return res.status(200).json({ users });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to fetch all users" });
    }
};



exports.getAllAdmins = async(req, res) => {
    try {
        const users = await User.find({ role: "admin" }).select('-password');
        return res.status(200).json({ users });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to fetch all users" });
    }
};