const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async() => {
    try {
        mongoose.connect(process.env.DATABASE_URL, {
            // yeh deprecate ho chuki hai so dont use it 
            // useUnifiedToplogy: true,
            // useNewUrlParser: true,
        })

        console.log("Connected Successfully");

    } catch (e) {
        console.error(e);
    }
}

module.exports = dbConnect;