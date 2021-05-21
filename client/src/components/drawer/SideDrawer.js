import React from 'react'
import { Button, Drawer} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const SideDrawer = () => {
    const dispatch = useDispatch();
    const {drawer, cart} = useSelector((state) => ({...state}));
    
    const imageStyle = {
        width: "50%",
        height: "50px",
        objectFit: "cover"
    }
    return (
        <Drawer 
            className="text-center"
            title={`Cart/${cart.length} Product`}
            placement="right"
            onClose={() => {
            dispatch({
                type: "SET_VISIBILITY",
                payload: false
            })
            }}
            visible={drawer}
        >
        {cart.map((p) =>(
            <div key={p._id} className="row">
                <div  className="col">
                    {
                        p.images && (p.images[0] ? (
                            <>
                            <img src={p.images[0].url} style={imageStyle}/>
                            <p className="text-center bg-secondary text-light">{`${p.title.substring(0,20)}...`}x{p.count}</p>
                            </>
                        ) : ""
                        )}
                </div>
            </div>
        ))}
        <Link to="/cart">
        <Button
             onClick={() => 
                    dispatch({
                        type: "SET_VISIBILITY",
                        payload: false
                    })
                }
            type="primary" 
            block
            shape="round"
            size="large"
         
        >
        GO TO CART
        </Button>
        </Link>
        </Drawer>
    )
}

export default SideDrawer;
