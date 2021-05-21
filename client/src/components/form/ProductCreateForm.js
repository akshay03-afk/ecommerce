import React from 'react';
import { Button, Select } from "antd";
const { Option } = Select;

const ProductCreateForm = ({handleSubmit, handleCategoryChange, handleChange, values, setValues,  subOptions, showSub}) => {
    
    const  { title, 
        description, 
        price, 
        category, 
        categories, 
        subCategory, 
        shipping, 
        quantity, 
        images , 
        color, 
        colors, 
        brand, 
        brands } = values;

    return (
        <form onSubmit={handleSubmit} className="col-md-6">
            <div className="form-group">
                <label>Title</label>
                <input 
                    type="text"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input 
                    type="text"
                    name="price"
                    className="form-control"
                    value={price}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input 
                    type="text"
                    name="description"
                    className="form-control"
                    value={description}
                    onChange={handleChange}
                />
            </div>
            
        
            <div className="form-group">
                <label>Shipping</label>
                <select 
                    name="shipping" 
                    className="form-control" 
                    onChange={handleChange}
                >   
                    <option>Please select</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>

                </select>
            </div>
            <div className="form-group">
                <label>Quantity</label>
                <input 
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange}
                />
            </div>
        
        
            <div className="form-group">
                <label>Brand</label>
                <select 
                    name="brand" 
                    className="form-control" 
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    {brands.map(b => 
                        <option key={b} value={b}>{b}</option>
                    )}

                </select>
            </div>
            <div className="form-group">
                <label>Color</label>
                <select 
                    name="color" 
                    className="form-control" 
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    {colors.map(c => 
                        <option key={c} value={c}>{c}</option>
                    )}

                </select>
            </div>
            <div className="form-group">
                    <label>Category</label>
                        <select 
                            name="category" 
                            className="form-control" 
                            onChange={handleCategoryChange}
                        >
                            <option>Please select</option>
                               {categories.length > 0 && categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                        {c.name}
                                </option>
                               ))}
                        </select>
            </div>

                                
            {showSub && (
            <div>
                <label>SubCategories</label>
                    
                <Select 
                        mode="multiple"
                        style={{width : "100%"}}
                        placeholder="Please Select"
                        value={subCategory}
                        onChange={(value) => setValues({...values, subCategory: value})}
                >   
                    {subOptions.length && 
                        subOptions.map((s) => 
                            <Option key={s._id} value={s._id}>{s.name}</Option>                        
                        )    
                    }
                </Select>
            </div>
            )}
            

        <Button 
            onClick={handleSubmit}
            type="primary"
            shape="round"
            size="large"        
            className="mt-3">SAVE</Button>
       
        
    </form>
    )
}

export default ProductCreateForm;
