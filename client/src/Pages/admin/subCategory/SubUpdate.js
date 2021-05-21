import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategories } from "../../../functions/category";
import { getSubCategory, updateSubCategory } from "../../../functions/subCategory";
import CategoryForm from '../../../components/form/CategoryForm';
import Loader from "../../../components/Loader";

const SubUpdate = ({history, match}) => {
    const {user} = useSelector((state) => ({...state}));
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [parent, setParent] = useState("");


    useEffect(() =>{
        loadCategories(); 
        loadSubCategory();
    },[]);

    const loadCategories = () => 
        getCategories()
        .then(c => 
            setCategories(c.data));
    
    const loadSubCategory = () => 
    getSubCategory(match.params.slug)
    .then((s) => {
        setName(s.data.name);
        setParent(s.data.parent);
    })

    const handleSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);
        updateSubCategory(match.params.slug, {name, parent}, user.token)
        .then(res =>{
            setLoading(false);
            setName("");
            toast.success(`${res.data.name} Subcategory is updated`);
            history.push("/admin/sub");
        })
        .catch(err =>{
            setLoading(false);
            if(err.response.status === 400) toast.error(err.response.data);
        });

    };
   
    
    
    return (
        <div className="container-fluid">
             <div className="row">
                <div className="col-md-2">
                <AdminNav />
                </div>
                 <div className="col-md-10">
                 {loading ? <Loader className="text-center"/> : <h4 className="display-4 mt-2 m b-3 text-center">Update Subcategory Page</h4>}
                        
                        <div className="form-group">
                            <label>Parent Category</label>
                            <select 
                                name="category" 
                                className="form-control col-md-6 col-sm-6" 
                                onChange={(e) => setParent(e.target.value)}>
                               <option>Please select</option>
                               {categories.length > 0 && categories.map((c) => (
                                    <option key={c._id} value={c._id} selected={c._id === parent}>
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
                       
                 </div>
             </div>
         </div>
    )
}

export default SubUpdate;
