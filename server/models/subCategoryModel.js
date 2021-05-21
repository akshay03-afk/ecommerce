const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subCategorySchema = new mongoose.Schema({
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
    },
    parent : {
        type: ObjectId,
        ref: "Category",
        required: true
    }
},{timestamps : true});

module.exports = mongoose.model("SubCategory", subCategorySchema);