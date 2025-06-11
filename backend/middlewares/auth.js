const jwt = require('jsonwebtoken');

require('dotenv').config();


exports.authMiddleware = (req, res, next) => {
    try {
        let token;

        // Check if token is in req.body
        if (req.body && req.body.token) {
            token = req.body.token;
        }
        // Else check cookie token
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // Else check Authorization header safely
        else if (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.error("JWT verify error:", err.message);
        return res.status(401).json({ message: "Token verification failed" });
    }
};