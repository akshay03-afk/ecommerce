import React,{ useState} from 'react'
import { useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import ProductCartInCheckOut from "../components/cards/ProductCartInCheckOut";
import { userCart } from "../functions/user";
import { Button } from "antd";

const Cart = ({history}) => {
    const { user, cart} = useSelector((state) => ({...state}));
    const dispatch = useDispatch();
   

    const getTotal = () =>{
        return cart.reduce((currentValue, nextValue) =>{
            return currentValue + nextValue.count * nextValue.price
        },0)
    }

    const saveOrderToDb = () =>{
        //console.log(cart);
        userCart(cart, user.token)
        .then(res =>{
            //console.log("cart post res", res)
            if(res.data.ok){
                history.push("/checkout")
            }
        }).catch(err =>{
            console.log("Cart save Error", err);
        })
        
    }
    const saveCashOrderToDb = () =>{
        //console.log(cart);
        dispatch({
            type: "COD",
            payload: true
        })
        userCart(cart, user.token)
        .then(res =>{
            //console.log("cart post res", res)
            if(res.data.ok){
                history.push("/checkout")
            }
        }).catch(err =>{
            console.log("Cart save Error", err);
        })
        
    }

    const showCartItems = () =>(
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Images</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            {cart.map((p) => (
                <ProductCartInCheckOut key={p._id} p={p} />
            ))}
        </table>
    )
    return (
            <div className="container-fluid pt-2">
            <div className="row">
                <h4 className="pl-3">Cart/ {cart.length} Products</h4>
                
            </div>
               <div className="row">
                    <div className="col-md-8">
                        {
                            !cart.length ? (
                                <p>
                                    No  Products in the cart. 
                                    <Link to="/"> Continue Shopping</Link>
                                </p>
                            ) : (
                                showCartItems()
                            )
                        }
                    </div>
                    <div className="col-md-4">
                        <h5>Order Summary</h5>
                        <hr />
                        <h6>Products :-</h6>
                        {cart.map((c, i) => (
                            <div key={i}>
                                <p>{`${c.title.substring(0,40)}...`} x <b>{c.count}</b> = <b>${c.price * c.count}</b> </p>
                            </div>
                        ))}
                        <hr />
                        Total: <b>${getTotal()}</b>
                        <hr />
                        {
                            user ? (
                                <>
                                    <Button 
                                        onClick={saveOrderToDb}
                                        disabled={!cart.length} 
                                        type="primary" 
                                        className="mt-2"
                                        block
                                        shape="round"
                                        size="large">
                                            PROCEED TO CHECKOUT
                                    </Button><br />

                                    <Button 
                                        onClick={saveCashOrderToDb}
                                        disabled={!cart.length} 
                                        type="primary" 
                                        className="mt-2"
                                        block
                                        shape="round"
                                        size="large">
                                            CASH ON DELIVERY
                                    </Button>
                                </>
                
                            ) : (
                                <Button 
                                        type="primary" 
                                        className="mt-2"
                                        block
                                        shape="round"
                                        size="large"
                                >
                                    <Link to={{
                                        pathname: "/login",
                                        state: {
                                            from: "cart"
                                        }
                                    }}>LOGIN TO CHECKOUT</Link>  
                                </Button>
                               
                            )
                        }
                    </div>
               </div>
            
        </div>
        
              
    )
}

export default Cart;
