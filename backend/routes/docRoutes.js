const express = require("express");
const router = express.Router();
const {
    createDoc,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocumentsByUser,
    addCollaborator,
    removeCollaborator,
} = require("../controllers/docController");

const { body } = require("express-validator");
const { authMiddleware } = require("../middlewares/auth");

router.post(
    "/createdoc",
    authMiddleware, [
        body("title").notEmpty().withMessage("Title is required"),
        body("collaborators").isArray().withMessage("Collaborators should be an array"),
    ],
    createDoc
);

router.get("/mydoc", authMiddleware, getDocumentsByUser);


router.get("/getdoc/:id", authMiddleware, getDocumentById);

router.put("/updatedoc/:id", authMiddleware, updateDocument);

router.delete("/deletedoc/:id", authMiddleware, deleteDocument);

router.post("/add/:id/collaborators", authMiddleware, addCollaborator);

router.delete("/delete/:id/collaborators", authMiddleware, removeCollaborator);

module.exports = router;