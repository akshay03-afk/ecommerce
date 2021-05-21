import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import { createCategory, getCategories, removeCategory } from "../../../functions/category";
import CategoryForm from '../../../components/form/CategoryForm';
import LocalSearch from '../../../components/form/LocalSearch';
import Loader from '../../../components/Loader';

const CategoryCreate = () => {
    const {user} = useSelector((state) => ({...state}));
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    //search/filter -> step 1
    const [keyword, setKeyword] = useState("");

    

    useEffect(() =>{
        loadCategories();
    },[]);

    const loadCategories = () => getCategories().then(c => setCategories(c.data));

    const handleSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);
        createCategory({name}, user.token)
        .then(res =>{
            setLoading(false);
            setName("");
            toast.success(`${res.data.name} category is created`);
            loadCategories();
        })
        .catch(err =>{
            setLoading(false);
            if(err.response.status === 400) toast.error(err.response.data);
        });

    };

    const handleRemove = async (slug) => {
        let answer = window.confirm("Delete?");
        if(answer){
            setLoading(true);
            removeCategory(slug, user.token)
            .then(res =>{
                setLoading(false);
                toast.error(`${res.data.name} deleted`);
                loadCategories();
            })
            .catch(err => {
                if(err.response.status === 400) toast.error(err.response.data);
            })
        }
    }
    
    
    const searched = (keyword) => (category) =>
        category.name.toLowerCase().includes(keyword);    
    
    
    return (
        <div className="container-fluid">
             <div className="row">
                <div className="col-md-2">
                <AdminNav />
                </div>
                 <div className="col">
                 {loading ? <Loader className="text-center"/> : <h4 className="display-4 mt-2 m b-3 text-center">Create Category Page</h4>}
                 <hr />
                        <CategoryForm 
                            handleSubmit={handleSubmit} 
                            name={name} 
                            setName={setName}

                        />
                        <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                        
                        
                    
                        {categories.filter(searched(keyword)).map(category =>(
                            <div className="alert alert-primary" key={category._id}>{category.name}
                            
                            <span onClick={() => handleRemove(category.slug)} className="btn btn-sm float-right pt-0 pb-1 pr-1">
                                <DeleteOutlined className="text-danger" />
                            </span>

                            <Link to={`/admin/category/${category.slug}`}>
                                <span className="btn btn-sm float-right pt-0 pb-1">
                                <EditOutlined className="text-primary"/>
                                </span>
                            </Link>
                                
                            </div>
                        ))}
                 </div>
             </div>
         </div>
    )
}

export default CategoryCreate;
