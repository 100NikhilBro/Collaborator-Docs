const express = require("express");
const { body, param } = require("express-validator");
const {
    createActivity,
    getActivityById,
    getActivitiesByDocument,
    getActivitiesByUser,
    deleteActivity,
} = require("../controllers/activityController");

const { authMiddleware } = require("../middlewares/auth");
const { checkDocumentOwnership } = require("../middlewares/owner");

const router = express.Router();

// 1. Create Activity
router.post(
    "/activity",
    authMiddleware, [
        body("user").notEmpty(),
        body("document").notEmpty(),
        body("action").notEmpty(),
    ],
    createActivity
);

// 2. Get activity by ID
router.get(
    "/getActivity/:id",
    authMiddleware, [param("id").notEmpty()],
    getActivityById
);

// 3. Get all activities by Document
router.get(
    "/document/:documentId",
    authMiddleware, [param("documentId").notEmpty()],
    checkDocumentOwnership,
    getActivitiesByDocument
);

// 4. Get all activities by User
router.get(
    "/user/:userId",
    authMiddleware, [param("userId").notEmpty()],
    getActivitiesByUser
);

// 5. Delete activity
router.delete(
    "/:id",
    authMiddleware,
    deleteActivity
);

module.exports = router;