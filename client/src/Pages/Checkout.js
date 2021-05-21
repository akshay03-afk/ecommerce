import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { getUserCart, emptyUserCart , saveUserAddress, applyCoupon, createCashOrderForUser} from "../functions/user";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // ES6
import { Button } from 'antd';



const Checkout = ({history}) => {
    let dispatch = useDispatch();
    
    const [ products, setProducts] = useState([])
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState("");
    const { user, cod} = useSelector((state) => ({...state}));
    const couponTrueOrFalse = useSelector((state) => state.coupon);
    useEffect(() => {
        getUserCart(user?.token)
            .then(res =>{
                //console.log("user Cart res", res.data)
                setProducts(res.data.products);
                setTotal(res.data.cartTotal);
            })
    }, [])

    const saveAddressToDB = () =>{
        //console.log(address)
        saveUserAddress(user.token, address)
        .then(res =>{
            //console.log("address", res)
            setAddressSaved(true)
            toast.success("Address Saved");
            
        })

    }

    const emptyCart = () => {
        //remove from local Storage
        if(typeof window !== "undefined"){
            localStorage.removeItem("cart")
        }
        //remove from redux
        dispatch({
            type: "ADD_TO_CART",
            payload: []
        })
       
        //remove from backend   
        emptyUserCart(user.token)
        .then(res =>{
            setProducts([])
            setTotal(0);
            setTotalAfterDiscount(0)
            setCoupon("")
            toast.success("Cart is empty. Continue Shopping")
        })

    }

    const showAddress =() =>
    <>
        <p><h4>Delivery Address</h4>Please enter correct address(Street, Street No, Place, PostalCode, City, Country)</p>
                
        <ReactQuill theme="snow" value={address} onChange={setAddress}/>
        <Button 
            type="primary" 
            className="mt-2"
            
            shape="round"
            size="large"
            disabled={address===""}
            onClick={saveAddressToDB}
            >
            SAVE
        </Button>
    </>
    


    const showProductSummary = () =>{
        return products.map((p,i) =>(
            <div key={i}>
                <p>{p.product?.title}({p.color}) x <b>{p.count}</b>= {" "} <b>${p.product?.price * p.count}</b></p>
            </div>
        ))
    }
    const applyDiscountCoupon = () =>{
        //console.log(coupon);
        applyCoupon(user.token, coupon)
        .then(res =>{
            //console.log("res on coupon Applied", res.data);
            if(res.data){
                setTotalAfterDiscount(res.data);
                //update redux coupon applied
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true   
                })
            }
            if(res.data.err){
                setDiscountError(res.data.err);
                //update redux coupon applied
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false  
                })
            }
        })


    }

    const showApplyCoupon = () => (
        <>
            <label>Enter Coupon(PROMO555, SMILE123, WINTER2021, SUMMER2021)</label>
            <input 
                type="text"
                className="form-control col-md-6"
                onChange={(e)=> {
                    setCoupon(e.target.value)
                    setDiscountError("")
                    }}
                value={coupon}
                
            />
                {discountError && <p className="text-danger pt-2">{discountError}</p>}

            <Button 
                onClick={applyDiscountCoupon}
                type="primary" 
                className="mt-2 mb-5"
                shape="round"
                size="large">
                Apply
            </Button>
        </>
    )

    const createCashOrder = () =>{
        createCashOrderForUser(user.token, cod, couponTrueOrFalse)
        .then(res =>{
            //console.log("Cash order created", res.data);
            if(res.data.ok){
                //empty local storage
                if(typeof window !== "undefined") localStorage.removeItem("cart")
                //empty redux cart
                dispatch({
                    type: "ADD_TO_CART",
                    payload: []
                })
                //empty coupon applied
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false
                })
                //empty cod
                dispatch({
                    type: "COD",
                    payload: []
                })
                //empty cart from backend
                emptyUserCart(user?.token);
                //redirect
                setTimeout(() =>{
                    history.push("/user/history")
                },1000)
            }

        })
    }
    return (
        <div className="row pt-3 ml-2">
            <div className="col-md-6">
                
                {showAddress()}
                <br /><hr />
                <h4>Got Coupon?</h4>
                
                {showApplyCoupon()}
            </div>
            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <h6>Products:- <b>{products.length}</b></h6>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart total: <b>${total}</b> </p>
                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">Discount Applied(payable): <b>${totalAfterDiscount}</b></p>
                )}
                <div className="row">
                <div className="col-md-6">
                    {cod ? (
                        <Button 
                            onClick={createCashOrder}
                            type="primary" 
                            className="mt-2"
                            block
                            shape="round"
                            size="large" 
                            disabled={!addressSaved || !products.length}>
                            Place Order
                        </Button>
                    ) : ( 
                        <Button 
                            onClick={() => history.push("/payment")}
                            type="primary" 
                            className="mt-2"
                            block
                            shape="round"
                            size="large" 
                            disabled={!addressSaved || !products.length}>
                            PLACE ORDER
                        </Button>
                    )}
                </div>

                <div className="col-md-6">
                    <Button 
                        onClick={emptyCart} 
                        type="danger" 
                        className="mt-2"
                        block
                        shape="round"
                        size="large" 
                        disabled={!products.length}
                    >
                    EMPTY CART
                    </Button>
                </div>

            </div>    
            </div>
      
        </div>
    )
}

export default Checkout;
