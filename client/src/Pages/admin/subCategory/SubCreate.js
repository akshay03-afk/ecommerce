import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import { getCategories } from "../../../functions/category";
import { createSubCategory, getSubCategories, removeSubCategory } from "../../../functions/subCategory";
import CategoryForm from '../../../components/form/CategoryForm';
import LocalSearch from '../../../components/form/LocalSearch';
import Loader from '../../../components/Loader';

const SubCreate = () => {
    const {user} = useSelector((state) => ({...state}));
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [subCategories, setSubCategories] = useState([]);
    const [category, setCategory] = useState([]);

    //search/filter -> step 1
    const [keyword, setKeyword] = useState("");

    

    useEffect(() =>{
        loadCategories();
        loadSubCategories();
    },[]);

    const loadCategories = () => getCategories().then(c => setCategories(c.data));
    
    const loadSubCategories = () => getSubCategories().then(c => setSubCategories(c.data));

    const handleSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);
        createSubCategory({name, parent: category}, user.token)
        .then(res =>{
            setLoading(false);
            setName("");
            toast.success(`${res.data.name} Subcategory is created`);
            loadSubCategories();
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
            removeSubCategory(slug, user.token)
            .then(res =>{
                setLoading(false);
                toast.error(`${res.data.name} deleted`);
                loadSubCategories();
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
                 <div className="col-md-10">
                 {loading ? <Loader className="text-center"/> : <h4 className="display-4 mt-2 m b-3 text-center">Create Subcategory Page</h4>}
                        <hr />
                        <div className="form-group">
                            <label>Select Category</label>
                            <select name="category" className="form-control col-md-6 col-sm-6" onChange={(e) => setCategory(e.target.value)}>
                               <option>Please select</option>
                               {categories.length > 0 && categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                               ))}
                            </select>
                        </div> 

                        <CategoryForm 
                            handleSubmit={handleSubmit} 
                            name={name} 
                            setName={setName}

                        />
                        <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                        
                        
                    
                        {subCategories.filter(searched(keyword)).map(s =>(
                            <div className="alert alert-primary" key={s._id}>{s.name}
                            
                            <span onClick={() => handleRemove(s.slug)} className="btn btn-sm float-right pt-0 pb-1 pr-1">
                                <DeleteOutlined className="text-danger" />
                            </span>

                            <Link to={`/admin/sub/${s.slug}`}>
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

export default SubCreate;
