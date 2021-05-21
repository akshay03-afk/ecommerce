import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { createProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductCreateForm from "../../../components/form/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/form/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import Loader from '../../../components/Loader';

const initialState = {
    title: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    subCategory: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue", "Gold", "Yellow", "Purple", "Red", "Grey"],
    brands: ["Apple", 
    "Samsung", 
    "Microsoft", 
    "Lenovo", 
    "Asus", 
    "HP", 
    "Alienware", 
    "Acer", 
    "Amazon Basics", 
    "Sony", 
    "TCL",
    "LG",
    "MIVI",
    "Amazon",
    "Noise",
    "JBL",
    "Beats",
    "Google",
    "OnePlus",
    "Moto",
    "Vivo",
    "Dell",
    "cosmicBytes",
    "RedGear",
    "Razor",
    "Logitech",
    "Corsair",
    "WD",
    "Seagate",
    "Others"
    ],
    color: "",
    brand: ""
}

const ProductCreate = ({history}) => {
    const { user } = useSelector((state) =>({...state}))
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSub, setShowSub] = useState(false);

    useEffect(() =>{
        loadCategories();
    },[]);

    const loadCategories = () => getCategories().then(c => setValues({...values, categories: c.data}));

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
        .then(res =>{
            //console.log(res);
            window.alert(`${res.data.title} is created`);
            console.log(res.data.title);
            window.location.reload();
            
        })
        .catch(err => {
            //if(err.response.status === 400) toast.error(err.response.data);
            toast.error(err.response.data.err);
        })
    }

    const handleChange = (e) =>{
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleCategoryChange = (e) =>{
        e.preventDefault();
        //console.log(e.target.value);
        setValues({...values, subCategory: [], category: e.target.value});
        getCategorySubs(e.target.value)
        .then(res => {
            // console.log("sub options",res.data)
            setSubOptions(res.data);
        });
        setShowSub(true);
       
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />

                </div>
                <div className="col-md-10">
                {loading ? <Loader className="text-center"/> : <h4 className="display-4 mt-2 m b-3 text-center">Create Product Page</h4>}
                <hr />
                <div className="p-3">
                    <FileUpload  
                        values={values} 
                        setValues={setValues} 
                        setLoading={setLoading}

                    />
                </div>    
                <ProductCreateForm 
                    handleSubmit={handleSubmit} 
                    handleChange={handleChange} 
                    values={values}
                    setValues={setValues}
                    handleCategoryChange={handleCategoryChange} 
                    subOptions={subOptions}
                    showSub={showSub}

                /> 
                </div>

            </div>
            
        </div>
    )
}

export default ProductCreate;

