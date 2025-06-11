const User = require("../models/User");
const Doc = require("../models/Document");
const { validationResult } = require("express-validator");
const { cleanInput } = require("../utils/sanitizeInput");


exports.createDoc = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    try {
        const { title, collaborators } = cleanInput(req.body);
        const owner = req.user.id; // bhai owner to logged in user hoga na kya samjhe 

        if (!title || !collaborators) {
            return res.status(400).json({
                success: false,
                message: "Title and collaborators are required",
            });
        }

        // Check collaborators format --> yeh hai tagdi cheej to 
        const validCollaborators = collaborators.every(col => col.user && col.role && ["editor", "viewer"].includes(col.role));
        if (!validCollaborators) {
            return res.status(400).json({
                success: false,
                message: "Collaborators should have valid 'user' and 'role'",
            });
        }

        const newDoc = new Doc({
            title,
            owner,
            collaborators,
        });

        await newDoc.save();

        return res.status(201).json({
            success: true,
            document: newDoc,
            message: "Document created successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create document",
        });
    }
};


exports.getDocumentById = async(req, res) => {
    try {
        const docId = req.params.id;
        const userId = req.user.id; // assuming auth middleware sets req.user

        const document = await Doc.findById(docId)
            .populate('owner', 'name email role')
            .populate('collaborators.user', 'name email role');

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if user is owner or collaborator
        const isAuthorized = document.owner._id.equals(userId) ||
            document.collaborators.some(c => c.user._id.equals(userId));

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Access denied' });
        }

        return res.status(200).json({ document });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.updateDocument = async(req, res) => {
    try {
        const docId = req.params.id;
        const userId = req.user.id;
        const { title } = req.body;

        const doc = await Doc.findById(docId);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Check permission: owner or collaborator with editor role
        if (!doc.owner.equals(userId) &&
            !doc.collaborators.some(c => c.user.equals(userId) && c.role === "editor")
        ) {
            return res.status(403).json({ message: "Not authorized to update" });
        }

        if (title) doc.title = title;

        await doc.save();

        return res.status(200).json({ document: doc, message: "Document updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update document" });
    }
};



exports.deleteDocument = async(req, res) => {
    try {
        const docId = req.params.id;
        const userId = req.user.id;

        const doc = await Doc.findById(docId);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (!doc.owner.equals(userId)) {
            return res.status(403).json({ message: "Not authorized to delete" });
        }

        await Doc.findByIdAndDelete(docId);

        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete document" });
    }
};


exports.getDocumentsByUser = async(req, res) => {
    try {
        const userId = req.user.id;

        const docs = await Doc.find({
            $or: [
                { owner: userId },
                { "collaborators.user": userId }
            ]
        }).populate('owner', 'name email role').populate('collaborators.user', 'name email role');

        return res.status(200).json({ documents: docs, userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};



exports.addCollaborator = async(req, res) => {
    try {
        const docId = req.params.id;
        const userId = req.user.id;
        const { collaboratorId, role } = req.body;

        if (!collaboratorId || !role) {
            return res.status(400).json({ message: "Collaborator ID and role required" });
        }

        const doc = await Doc.findById(docId);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (!doc.owner.equals(userId)) {
            return res.status(403).json({ message: "Only owner can add collaborators" });
        }

        const isAlreadyCollaborator = doc.collaborators.some(c => c.user.equals(collaboratorId.trim()));
        if (isAlreadyCollaborator) {
            return res.status(400).json({ message: "User already a collaborator" });
        }

        doc.collaborators.push({ user: collaboratorId.trim(), role });
        await doc.save();

        return res.status(200).json({ document: doc, message: "Collaborator added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add collaborator" });
    }
};



exports.removeCollaborator = async(req, res) => {
    try {
        const userId = req.user.id;
        const docId = req.params.id;
        const { collaboratorId } = req.body;

        if (!userId || !docId || !collaboratorId) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const doc = await Doc.findById(docId);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }


        if (doc.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only owner can remove collaborators" });
        }

        const isAlreadyCollaborator = doc.collaborators.some(c =>
            c.user.toString() === collaboratorId.toString()
        );

        if (!isAlreadyCollaborator) {
            return res.status(404).json({ message: "Collaborator not found" });
        }

        //   sbse important logic ---> filter ka --> remeber it --> jb bhi array mein --> remove krna ho --> go for filter --> nyi array jo condn ko satisfy nyi krneg --> !== use kiya hai 
        doc.collaborators = doc.collaborators.filter(c =>
            c.user.toString() !== collaboratorId.toString()
        );

        await doc.save();

        return res.status(200).json({
            message: "Collaborator removed successfully",
            document: doc
        });

    } catch (e) {
        console.error("Remove Collaborator Error:", e);
        res.status(500).json({ message: "Something went wrong" });
    }
};