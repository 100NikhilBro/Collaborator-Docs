const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    collaborators: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["editor", "viewer"],
            required: true,
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model("Doc", docSchema);