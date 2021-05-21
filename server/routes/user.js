const express = require("express");
const router = express.Router();

const { authCheck } = require("../middlewares/auth"); 

const { userCart,
        getUserCart, 
        emptyCart, 
        saveAddress, 
        applyCoupon, 
        createOrder, 
        orders,
        addToWishList,
        wishList,
        removeFromWishList,
        createCashOrder
        } = require("../controllers/user"); 


router.post("/user/cart", authCheck, userCart) //save cart
router.get("/user/cart", authCheck, getUserCart) // get cart
router.delete("/user/cart", authCheck, emptyCart) //empty address
router.post("/user/address", authCheck, saveAddress); // save address
router.post("/user/cart/coupon", authCheck, applyCoupon);
router.post("/user/order", authCheck, createOrder);//stripe
router.post("/user/cash-order", authCheck, createCashOrder);//code
router.get("/user/orders", authCheck, orders)
router.post("/user/wishlist", authCheck, addToWishList);
router.get("/user/wishlist", authCheck, wishList)
router.put("/user/wishlist/:productId", authCheck, removeFromWishList)
module.exports = router;