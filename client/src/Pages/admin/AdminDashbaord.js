import React, {useEffect, useState} from 'react'
import AdminNav from '../../components/nav/AdminNav';
import { getOrders, changeStatus } from "../../functions/admin";
import { useSelector } from "react-redux";
import {toast} from "react-toastify";
import Orders from "../../components/order/Orders";
import Loader from "../../components/Loader"


const AdminDashbaord = () => {

    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([])

    const { user } = useSelector((state)=> ({...state}));

    useEffect(() => {
      loadOrders()
    }, [])

    const loadOrders  = () =>{
        getOrders(user.token)
        .then(res =>{
            console.log(res.data);
            setOrders(res.data);
        })
    }

    const handleStatusChange = (orderId, orderStatus) =>{
        changeStatus(orderId, orderStatus, user.token)
        .then(res =>{
            toast.success("Status updated");
            loadOrders();
        })
    }
    return (
        <div className="container-fluid">
             <div className="row">
                <div className="col-md-2">
                <AdminNav />
                </div>
                 <div className="col-md-10">
                    {loading ? <Loader className="text-center"/> : <h4 className="text-center display-4 mt-2 mb-3">Admin Dashbaord</h4>}
                    <hr />
                    <Orders orders={orders} handleStatusChange={handleStatusChange}/>
                 </div>
             </div>
         </div>
    )
}

export default AdminDashbaord;
