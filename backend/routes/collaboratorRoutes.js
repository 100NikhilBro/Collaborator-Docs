const express = require("express");
const { body, param } = require("express-validator");
const {
    addCollaborator,
    removeCollaborator,
    changeCollaboratorRole,
    getCollaborators,
} = require("../controllers/collabController");

const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post(
    "/add",
    authMiddleware, [
        body("docId").notEmpty().withMessage("Document ID is required"),
        body("userId").notEmpty().withMessage("Collaborator ID is required"),
        body("role").isIn(["editor", "viewer"]).withMessage("Role must be editor or viewer"),
    ],
    addCollaborator
);

router.delete(
    "/remove/:docId/:userId",
    authMiddleware, [
        param("docId").notEmpty().withMessage("Document ID is required"),
        param("userId").notEmpty().withMessage("Collaborator ID is required"),
    ],
    removeCollaborator
);



router.put(
    "/role",
    authMiddleware, [
        body("docId").notEmpty().withMessage("Document ID is required"),
        body("userId").notEmpty().withMessage("Collaborator ID is required"),
        body("role").isIn(["editor", "viewer"]).withMessage("Role must be editor or viewer"),
    ],
    changeCollaboratorRole
);



router.get(
    "/:docId",
    authMiddleware, [param("docId").notEmpty().withMessage("Document ID is required")],
    getCollaborators
);

module.exports = router;