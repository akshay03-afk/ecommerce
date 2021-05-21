const User = require("../models/userModel")
const Product = require("../models/productModel")
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
var uniqid = require('uniqid');

exports.userCart = async (req, res) => {
    //console.log(req.body);
    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({email: req.user.email}).exec();

    //check if cart with logged in user id already exist
    let cartExistByThisUser  = await Cart.findOne({orderedBy: user._id}).exec();

    if(cartExistByThisUser){
        cartExistByThisUser.remove();
        //console.log("remove old Cart", cartExistByThisUser);
    }
    for(let i=0;i<cart.length;i++){
        let object = {}
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        
        //get price for creating total
        let {price} = await Product.findById(cart[i]._id).select("price").exec();
        object.price = price;
        products.push(object);
    }
    //console.log("products", products)
    let cartTotal = 0;
    for(let i=0;i<products.length;i++){
        cartTotal= cartTotal + products[i].price * products[i].count;

    }
    //console.log("cart total", cartTotal);

    let newCart  = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
    }).save();
    
    //console.log("new Cart", newCart)
    res.json({ ok: true})

}

exports.getUserCart = async (req, res) =>{
    const user = await User.findOne({email: req.user.email}).exec();

    const cart = await Cart.findOne({orderedBy: user._id})
                .populate("products.product"," _id title price totalAfterDiscount")
                .exec();
    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json( {products, cartTotal, totalAfterDiscount} );
}

exports.emptyCart = async (req, res) =>{
    const user = await User.findOne({email: req.user.email}).exec();

    const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
    res.json(cart);
} 

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body.address }
    ).exec();
  
    res.json({ ok: true });
};

exports.applyCoupon = async (req, res) =>{
    const { coupon } = req.body;
    //console.log("coupon", coupon);

    const validCoupon = await Coupon.findOne({name: coupon}).exec();

    if(validCoupon === null){
        return res.json({
            err: "Invalid Coupon"
        })
    }
    //console.log("Valid Coupon", validCoupon);
    
    const user = await User.findOne({email: req.user.email}).exec();

    let { product, cartTotal} = await Cart.findOne(
        {
            orderedBy: user._id
        })
        .populate("products.product", "_id, title price")
        .exec();

    //console.log("cart Total", cartTotal, "discount", validCoupon.discount);

    //total after discount
    let totalAfterDiscount = (cartTotal -(cartTotal * validCoupon.discount)/100).toFixed(2);

    Cart.findOneAndUpdate(
        {
            orderedBy: user._id
        },
        {
            totalAfterDiscount
        },
        {
            new: true
        }).exec();
    res.json(totalAfterDiscount)


}

exports.createOrder = async(req, res) =>{
    const {paymentIntent} = req.body.stripeResponse;
    const user = await User.findOne({email: req.user.email}).exec();

    let { products } = await Cart.findOne({orderedBy: user._id}).exec();
    let newOrder = await new Order({
        products,
        paymentIntent,
        orderedBy: user._id
    }).save();

    //decrement the quantity, increment sold
    let bulkOption = products.map((item) =>{
        return {
            updateOne: {
                filter: { _id: item.product._id},
                update: { $inc: { quantity: -item.count , sold: +item.count }}
            }
        }
    })
    let updated = await Product.bulkWrite(bulkOption, {})
    //console.log("product increment sold and decrement", updated);

    //console.log("New Order", newOrder)
    res.json({ok : true})
}

exports.orders = async(req, res) =>{
    let user = await User.findOne({email: req.user.email}).exec();
    let userOrders  = await Order.find({orderedBy: user._id})
                .populate("products.product").exec();

    res.json(userOrders);
}

exports.addToWishList  = async( req, res) =>{
    const {productId} = req.body;
    const user = await User.findOneAndUpdate({email: req.user.email}, {$addToSet: {wishList : productId}}).exec();
     
    res.json({ok: true})
}

exports.wishList  = async( req, res) =>{
    let list = await User.findOne({email: req.user.email})
        .select("wishList")
        .populate("wishList")
        .exec();

    res.json(list);

}

exports.removeFromWishList  = async( req, res) =>{
    const {productId} = req.params;
    const user = await User.findOneAndUpdate({email: req.user.email}, {$pull: {wishList: productId}}).exec();
    res.json({ok: true});
} 

exports.createCashOrder = async(req, res) =>{
    const { cod , couponApplied} = req.body;

    // if cod is true create order with status on cash on delivery
    if(!cod) return res.status(400).send("Create cash order failed");

    const user = await User.findOne({email: req.user.email}).exec();

    let userCart = await Cart.findOne({orderedBy: user._id}).exec();
    
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100;
      } else {
        finalAmount = userCart.cartTotal * 100;
      }

    let newOrder = await new Order({
        products: userCart.products,
        paymentIntent:{
            id: uniqid(),
            amount: finalAmount,
            currency: "usd",
            status: "Cash On Delivery",
            createdAt: Date.now(),
            payment_method_types: ["cash"],   
        },
        orderedBy: user._id,
        orderStatus: "Cash On Delivery"
    }).save();

    //decrement the quantity, increment sold
    let bulkOption = userCart.products.map((item) =>{
        return {
            updateOne: {
                filter: { _id: item.product._id},
                update: { $inc: { quantity: -item.count , sold: +item.count }}
            }
        }
    })
    let updated = await Product.bulkWrite(bulkOption, {})
    //console.log("product increment sold and decrement", updated);

    //console.log("New Order", newOrder)
    res.json({ok : true})
}