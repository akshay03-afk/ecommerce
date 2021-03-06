const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minlength: [2, "Too Short"],
        maxlength: [32, "To Long"]
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        index: true    
    }
},{timestamps : true});

module.exports = mongoose.model("Category", categorySchema);