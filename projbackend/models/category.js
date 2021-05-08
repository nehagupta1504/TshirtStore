const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}, 
    {timestamps: true} // record the time at which the entry is made to database
);

module.exports = mongoose.model("Category", categorySchema);