const Activity = require("../models/ActivityLog");
const { validationResult } = require("express-validator");
const { cleanInput } = require("../utils/sanitizeInput");

// 1. Create activity (jab koi document edit, invite, ya role-change kare)
exports.createActivity = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { user, document, action } = cleanInput(req.body);

        if (!user || !document || !action) {
            return res.status(400).json({ message: "User, document, and action are required" });
        }

        const activity = new Activity({ user, document, action });
        await activity.save();

        return res.status(201).json({ activity, message: "Activity logged successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to log activity" });
    }
};




// 2. Get activity by ID (detail of single activity)
exports.getActivityById = async(req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate("user", "name email role")
            .populate("document", "title owner");

        if (!activity) return res.status(404).json({ message: "Activity not found" });

        return res.status(200).json({ activity });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to fetch activity" });
    }
};




// 3. Get all activities for a document (useful to show activity log per document)
exports.getActivitiesByDocument = async(req, res) => {
    try {
        const activities = await Activity.find({ document: req.params.documentId })
            .populate("user", "name email role")
            .sort({ createdAt: -1 }); // latest first

        return res.status(200).json({ activities });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to fetch activities" });
    }
};



// 4. Get all activities for a user (to track user’s actions)
exports.getActivitiesByUser = async(req, res) => {
    try {
        const activities = await Activity.find({ user: req.params.userId })
            .populate("document", "title owner")
            .sort({ createdAt: -1 });

        return res.status(200).json({ activities });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to fetch activities" });
    }
};



// 5. Optional: Delete activity by ID (if needed for cleanup)
exports.deleteActivity = async(req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);

        if (!activity) return res.status(404).json({ message: "Activity not found" });

        return res.status(200).json({ message: "Activity deleted successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to delete activity" });
    }
};