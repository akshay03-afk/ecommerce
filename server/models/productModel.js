const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 1000,
        text: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 10000,
        text: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    subCategory: [
        {
            type: ObjectId,
            ref: "SubCategory"
        }
    ],
    quantity: Number,
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    shipping: {
        type: String,
        enum : ["Yes", "No"],
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Silver", "White", "Blue", "Gold", "Yellow", "Purple", "Red", "Grey"]
    },
    brand: {
        type: String,
        enum : [
            "Apple", 
            "Samsung", 
            "Microsoft", 
            "Lenovo", 
            "Asus", 
            "HP", 
            "Alienware", 
            "Acer", 
            "Amazon Basics", 
            "Sony", 
            "TCL",
            "LG",
            "MIVI",
            "Amazon",
            "Noise",
            "JBL",
            "Beats",
            "Google",
            "OnePlus",
            "Moto",
            "Vivo",
            "Dell",
            "cosmicBytes",
            "RedGear",
            "Razor",
            "Logitech",
            "Corsair",
            "WD",
            "Seagate",
            "Others"

        ],
    },
    rating: [
        {
            star : Number,
            postedBy: { type: ObjectId, ref: "User"}
        }
    ]

},{timeStamps: true});

module.exports = mongoose.model("Product", productSchema);