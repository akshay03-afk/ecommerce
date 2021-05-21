import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { getCoupons, removeCoupon, createCoupon} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from '../../../components/nav/AdminNav';
import { Button } from 'antd';
import Loader from '../../../components/Loader';

const CreateCoupon = () => {
    const [name, setName] = useState("")
    const [expiry, setExpiry] = useState("")
    const [discount, setDiscount] = useState("")
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([])
    const { user } = useSelector((state) => ({...state}));

    useEffect(() => {
       loadAllCoupons()
    }, [])

    const loadAllCoupons = () => getCoupons()
    .then(res => setCoupons(res.data));

    const handleSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);
        //console.log(name, expiry, discount)
        if(name.length<6){
            alert("Make sure coupon name is longer than six characters");
            setLoading(false);
            setDiscount("")
            setName("")
            setExpiry("");
        }else{
            createCoupon({name, expiry, discount}, user.token)
            .then(res =>{
                setLoading(false);
                loadAllCoupons()
                setName("");
                setDiscount("");
                setExpiry("");
                console.log(res);
                toast.success(`${res.data.name} is created`);
                
            }).catch(err =>{
                console.log("Create Coupon failed",err);
                toast.error("Create coupon failed", err)
            })
        }
        
    }
    
    const handleRemove = (couponId) =>{
        if(window.confirm("Are you sure?")){
            setLoading(true);
            removeCoupon(couponId, user.token)
            .then(res =>{
                    loadAllCoupons()
                    setLoading(false);
                    toast.error(` Coupon ${res.data.name} is deleted`);
            }).catch(err =>{
                console.log(err);
            }) 
        }
}
    
    return (
        <div className="container-fluid">
        <div className="row"> 
           <div className="col-md-2">
           <AdminNav />
           </div>
           <div className="col-md-10">
           {loading ? <Loader className="text-center"/> : <h4 className="display-4 mt-2 m b-3 text-center">Create Coupon Page</h4>}
           <hr />

                <form onSubmit={handleSubmit} className="col-md-6">
                    <div className="form-group">
                        <label className="text-muted">Name</label>
                         <input 
                            type="text" 
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Discount %</label>
                        <input 
                            type="text" 
                            className="form-control"
                            onChange={(e) => setDiscount(e.target.value)}
                            value={discount}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Expiry</label><br />
                        <DatePicker 
                            className="form-control"
                            selected={new Date()}
                            value={expiry}
                            onChange={(date) => setExpiry(date)}
                            required
                        />
                    </div>
                    <Button
                        onClick={handleSubmit} 
                        type="primary"
                        shape="round"
                        size="large"        
                        className="mt-3">SAVE
                    </Button>
                </form>
                <br />
                <hr />
                <h4>{coupons.length} Coupons</h4>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {coupons.map((c) =>( 
                            <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>{new Date(c.expiry).toLocaleDateString()}</td>
                                <td>{c.discount}%</td>
                                <td><DeleteOutlined 
                                    className="text-danger pointer" 
                                    onClick={() => handleRemove(c._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

           </div>
        </div>
        </div>
    )
}

export default CreateCoupon;
