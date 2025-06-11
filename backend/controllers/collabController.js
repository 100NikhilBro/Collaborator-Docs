const Doc = require("../models/Document");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { cleanInput } = require("../utils/sanitizeInput");



// 1. Add collaborator to a document
exports.addCollaborator = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { docId, userId, role } = cleanInput(req.body);

        if (!docId || !userId || !role) {
            return res.status(400).json({ message: "Document ID, User ID, and role are required" });
        }

        const doc = await Doc.findById(docId);
        if (!doc) return res.status(404).json({ message: "Document not found" });

        // Check if user already collaborator
        const existingCollab = doc.collaborators.find(c => c.user.toString() === userId);
        if (existingCollab) {
            return res.status(400).json({ message: "User is already a collaborator" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        doc.collaborators.push({ user: userId, role });
        await doc.save();

        return res.status(200).json({ message: "Collaborator added successfully", collaborators: doc.collaborators });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to add collaborator" });
    }
};



// 2. Remove collaborator from document
exports.removeCollaborator = async(req, res) => {
    try {
        const { docId, userId } = req.params;

        if (!docId || !userId) {
            return res.status(400).json({ message: "Document ID and User ID are required" });
        }

        const doc = await Doc.findById(docId);
        if (!doc) return res.status(404).json({ message: "Document not found" });

        const collabIndex = doc.collaborators.findIndex(c => c.user.toString() === userId);
        if (collabIndex === -1) {
            return res.status(404).json({ message: "Collaborator not found" });
        }

        doc.collaborators.splice(collabIndex, 1);
        await doc.save();

        return res.status(200).json({ message: "Collaborator removed successfully", collaborators: doc.collaborators });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to remove collaborator" });
    }
};



// 3. Change collaborator role (editor/viewer)
exports.changeCollaboratorRole = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { docId, userId, role } = cleanInput(req.body);

        if (!docId || !userId || !role) {
            return res.status(400).json({ message: "Document ID, User ID, and new role are required" });
        }

        const doc = await Doc.findById(docId);
        if (!doc) return res.status(404).json({ message: "Document not found" });

        const collaborator = doc.collaborators.find(c => c.user.toString() === userId);
        if (!collaborator) {
            return res.status(404).json({ message: "Collaborator not found" });
        }

        collaborator.role = role;
        await doc.save();

        return res.status(200).json({ message: "Collaborator role updated successfully", collaborators: doc.collaborators });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to update collaborator role" });
    }
};



// 4. Get collaborators of a document
exports.getCollaborators = async(req, res) => {
    try {
        const { docId } = req.params;
        if (!docId) return res.status(400).json({ message: "Document ID is required" });

        const doc = await Doc.findById(docId).populate("collaborators.user", "name email role");
        if (!doc) return res.status(404).json({ message: "Document not found" });

        return res.status(200).json({ collaborators: doc.collaborators });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to get collaborators" });
    }
};