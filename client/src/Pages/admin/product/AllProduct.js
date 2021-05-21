import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { getProductsByCount } from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import {removeProduct} from "../../../functions/product";
import { useSelector } from "react-redux";
import {toast} from "react-toastify";
import Loader from '../../../components/Loader';

const AllProduct = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => ({...state}));

    useEffect(() =>{
        loadAllProducts();

    },[]);

    const loadAllProducts = () =>{
        setLoading(true);
        getProductsByCount(100)
        .then(res => {
            console.log(res.data)
            setProducts(res.data)
            setLoading(false);
        })
        .catch((err)=> {
            setLoading(false);
            console.log(err) 
        })
    }
    
    const handleRemove = (slug) =>{
        if(window.confirm("Are you sure?")){
            // console.log(slug);
            removeProduct(slug, user.token)
            .then(res => {
                setLoading(false);
                loadAllProducts();
                toast.success(`${res.data.title} is deleted`)
            })
            .catch(err =>{
                setLoading(false);
                if(err.response.status === 400) toast.error(err.response.data);
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
                    {loading ? <Loader className="text-center"/>  : <h4 className="display-4 mt-2 mb-3 text-center">All Products</h4>}
                       <hr />
                        <div className="row">
                        {products?.map((product)=>(
                            <div className="col-md-6 col-lg-4" key={product._id}>
                                <AdminProductCard product={product} handleRemove={handleRemove} />

                            </div>
                        ))}
                        </div>
                        
                        
                 </div>
             </div>
         </div>
    )
}

export default AllProduct;
