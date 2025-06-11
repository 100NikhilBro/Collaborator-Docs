const Doc = require("../models/Document");

const checkDocumentOwnership = async(req, res, next) => {
    try {
        // documentId ya param se ya body se le lo
        const docId = req.params.documentId || req.body.document;
        if (!docId) {
            return res.status(400).json({ message: "Document ID is required" });
        }

        const doc = await Doc.findById(docId);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        const userId = req.user.id;

        // Owner check
        if (doc.owner.equals(userId)) {
            return next();
        }

        // Collaborator check for editor role
        const isEditor = doc.collaborators.some(
            (c) => c.user.toString() === userId.toString() && c.role === "editor"
        );

        if (!isEditor) {
            return res.status(403).json({ message: "Access denied: Not authorized" });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error in ownership check" });
    }
};

module.exports = { checkDocumentOwnership };