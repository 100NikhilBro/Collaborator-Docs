const mongoose = require('mongoose');

const actiSachema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doc",
        required: true,
    },
    action: {
        type: String,
        enum: ["edit", "invite", "role-change"],
        required: true,
    }

}, { timestamps: true });


module.exports = mongoose.model("Activity", actiSachema);