const Product = require("../models/productModel");
const User = require("../models/userModel");
const slugify = require("slugify");
const { aggregate } = require("../models/userModel");

exports.create = async (req, res) =>{
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        //res.status(400).send("Create Product Failed")
        res.json({
            err: err.messsage
        })
    }
}

exports.listAll = async (req, res) =>{
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subCategory")
    .sort([["createdAt", "desc"]])
    .exec()
    
    res.json(products);
}

exports.remove = async (req, res) =>{
    try {
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deleted);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Product deleted failed");
    }
}

exports.read = async (req, res) =>{
    const product = await Product.findOne({slug : req.params.slug})
    .populate("category")
    .populate("subCategory")
    .exec();
    res.json(product);
}

exports.update = async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);

        }
        const updated = await Product.findOneAndUpdate({slug : req.params.slug}, req.body, {new : true}).exec();
        res.json(updated);
        
    } catch (error) {
        console.log(error);
        // return res.status(400).send("Product Update Failed");
        res.json({
            err: err.messsage
        })
    }    
}

//without pagination
// exports.list = async (req, res) =>{
//     try {
//         //createdAt/updatedAt, desc/asc , 3
//         const { sort, order, limit } = req.body;
//         const products = await Product.find({})
//         .populate("category")
//         .populate("subCategory")
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec()
//         res.json(products);
//     } catch (err) {
//         console.log(err);
//         res.json({
//             err: err.messsage
//         })
//     }    
// }

//with pagination
exports.list = async (req, res) => {
    try {
      // createdAt/updatedAt, desc/asc, 3
      const { sort, order, page } = req.body;
     // console.log(req.body)
      const currentPage = page || 1;
      const perPage = 6; // 3
  
      const products = await Product.find({})
        .skip((currentPage -1) * perPage)
        .populate("category")
        .populate("subCategory")
        .sort([[sort, order]])
        .limit(perPage)
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };

exports.productsCount = async (req, res) =>{
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total)
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;
  
    // who is updating?
    // check if currently logged in user have already added rating to this product?
    var rating = parseFloat(rating);
    let existingRatingObject = product.rating.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );
  
    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { rating: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          rating: { $elemMatch: existingRatingObject },
        },
        { $set: { "rating.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  };

  exports.listRelated = async (req, res) =>{
    const product =  await Product.findById(req.params.productId).exec();
    const related = await Product.find({
      _id: { $ne : product._id},
      category: product.category,
    })
    .limit(3)
    .populate("category")
    .populate("subCategory")
    .populate("postedBy")
    .exec()
    //console.log("related",related);
    res.json(related);
    
  }
  
//search/filter

const handleQuery = async (req, res, query) =>{
  const products = await Product.find({ $text: { $search : query}})
  .populate("category", "_id name")
  .populate("subCategory", "_id name")
  .populate("postedBy", "_id name")
  .exec()

  res.json(products);

}

const handlePrice = async (req, res, price) =>{
    try {
      let products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1]
        },
      })
      .populate("category", "_id name")
      .populate("subCategory", "_id name")
      .populate("postedBy", "_id name")
      .exec()

      res.json(products);
    }catch(err){
      console.log(err);
    }
       
}

const handleCategory = async (req, res, category) =>{
  try {
      let products = await Product.find({category})
        .populate("category", "_id name")
        .populate("subCategory", "_id name")
        .populate("postedBy", "_id name")
        .exec()
        //console.log({category});
        res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const handleStar = (req, res, stars) =>{
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: {$avg: "$rating.star"},
        },
      },
    },
    {
      $match: { floorAverage: stars }
    }
  ])
  .limit(12)
  .exec((err, aggregates) =>{
    if(err) console.log("Aggregate Error", err)
    Product.find({_id: aggregates})
    .populate("category", "_id name")
    .populate("subCategory", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, products) =>{
      if(err) console.log("Product Aggregate Error", err)
      res.json(products);
    });
  })
}

const handleSub = async (req, res, subCategory) =>{
  const products = await Product.find({subCategory })
    .populate("category", "_id name")
    .populate("subCategory", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products);
}

const handleShipping = async (req, res, shipping) =>{
  const products = await Product.find({shipping })
    .populate("category", "_id name")
    .populate("subCategory", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products);
}

const handleColor = async (req, res, color) =>{
  const products = await Product.find({color })
    .populate("category", "_id name")
    .populate("subCategory", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products);
}

const handleBrand = async (req, res, brand) =>{
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subCategory", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products);
}

exports.searchFilters = async (req, res) =>{
  const { 
          query, 
          price, 
          category, 
          stars, 
          subCategory,
          brand,
          color,
          shipping,
        } = req.body
  if(query){
    await handleQuery(req, res, query);
  }
  //price [0 , 1000]
  if(price !== undefined){
    //console.log("price====>", price);
    await handlePrice(req, res, price);
  }
  if(category){
    //console.log("category", category)
    await handleCategory(req, res, category);
  }
  if(stars){
    //console.log("Stars", stars)
    await handleStar(req, res, stars);
  }
  if(subCategory){
   // console.log("subCategory", subCategory);
    await handleSub(req, res, subCategory)
  }
  if(shipping){
    console.log("shipping", shipping);
    await handleShipping(req, res, shipping);
  }
  if(color){
    console.log("color", color);
    await handleColor(req, res, color);
  }
  if(brand){
    console.log("brand", brand);
    await handleBrand(req, res, brand);
  }
}