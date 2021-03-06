const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async  (req,res ) =>{
    console.log(req.body)
    const { couponApplied }  = req.body;

    const user = await User.findOne({email: req.user.email}).exec();

    const { cartTotal, totalAfterDiscount} = await Cart.findOne({orderedBy: user._id}).exec();
    
    //console.log("cartTotal charged", cartTotal, "After discount", totalAfterDiscount);
    
    let finalAmount = 0;
    if( couponApplied && totalAfterDiscount){
            finalAmount = totalAfterDiscount*100;
    }else{
        finalAmount= cartTotal*100;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: "usd",
    })
    
    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount/100
    })
}