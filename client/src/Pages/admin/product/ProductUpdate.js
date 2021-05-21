import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { getProduct , updateProduct} from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCategories, getCategory, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/form/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from '../../../components/form/ProductUpdateForm';

const initialState = {
    title: "",
    description: "",
    price: "",
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

const ProductUpdate = ({match, history}) => {
    const { user } = useSelector((state) =>({...state}))
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(()=>{
        loadProduct();
        loadCategories();
    },[]);



    const loadProduct = () => {
        getProduct(match.params.slug)
        .then(p =>{
            // console.log(res)
            //load single product
            setValues({...values, ...p.data})
            //load single product category subs
            getCategorySubs(p.data.category?._id)
            .then((res) =>{
                setSubOptions(res.data)//first load default sub
            })
            //prepare array of sub ids
            let arr = []
            p.data.subCategory.map((s) => {
                arr.push(s._id);

        })
            setArrayOfSubs(prev => arr) //required for ant design select 
        })
    }

    const loadCategories = () => getCategories().then(c => setCategories(c.data));

    const handleSubmit =(e) =>{
        e.preventDefault();
        setLoading(true);
        values.subCategory = arrayOfSubs
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(match.params.slug, values, user.token)
        .then(res =>{
            setLoading(false)
            toast.success(`${res.data.title} is updated`)
            history.push("/admin/products")
             
        })
        .catch(err =>{
            console.log(err);
            setLoading(false);
            toast.error(err.response.data.err);
        })
    }

    const handleChange = (e) =>{
        setValues({...values, [e.target.name]: e.target.value});
    }
    const handleCategoryChange = (e) =>{
        e.preventDefault();
        //console.log(e.target.value);
        setValues({...values, subCategory: []});
        setSelectedCategory(e.target.value)
        getCategorySubs(e.target.value)
        .then(res => {
            // console.log("sub options",res.data)
            setSubOptions(res.data);
        });
        //if user clicks back to the original category
        //show ist sub category in default
        if(values.category?._id === e.target.value){
            loadProduct();
        }
        setArrayOfSubs([]);
       
    }
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />

                </div>
                <div className="col-md-10">
                {loading ? <LoadingOutlined className="text-danger h1"/> : <h4 className="display-4 mt-2 mb-3 text-center">Product Update</h4>}
                
                <hr />
                <div className="p-3">
                    <FileUpload  
                        values={values} 
                        setValues={setValues} 
                        setLoading={setLoading}

                    />
                </div> 
                   
                <ProductUpdateForm
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleCategoryChange={handleCategoryChange}
                    values={values}
                    setValues={setValues}
                    categories={categories}
                    subOptions={subOptions}
                    arrayOfSubs={arrayOfSubs}
                    setArrayOfSubs={setArrayOfSubs}
                    selectedCategory={selectedCategory}
                />
                </div>

            </div>
            
        </div>
    
    )
}

export default ProductUpdate;

