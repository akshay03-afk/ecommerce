const SubCategory = require("../models/subCategoryModel");
const Product = require("../models/productModel");
const slugify = require("slugify");

exports.create = async (req, res) =>{
    try {
        const { name, parent } = req.body;
        const subCategory = await new SubCategory({name, parent, slug: slugify(name)}).save();
        res.json(subCategory); 
    } catch (error) {
        res.status(400).send("Create subcategory failed");
    }
}

exports.list = async (req, res) =>{
    res.json( await SubCategory.find().sort({createdAt: -1}).exec());
}

exports.read = async (req, res) =>{
    let sub = await SubCategory.findOne({slug: req.params.slug}).exec();
    const products = await Product.find({subCategory : sub})
    .populate("category").exec()
    res.json({
        sub,
        products,
    })
    //res.json(subCategory);
}

exports.update = async (req, res) =>{
    const { name, parent } = req.body;
    try {
        const updated = await SubCategory.findOneAndUpdate({
            slug: req.params.slug},
            {name, parent, slug: slugify(name)},
            {new: true}
            ) 
        res.json(updated);   
    } catch (error) {
        res.status(400).send("Subcategory update Failed")
    }    
}

exports.remove = async (req, res) =>{
    try {
        const deleted = await SubCategory.findOneAndDelete({slug: req.params.slug});
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Sub Category delete failed");
    }
}