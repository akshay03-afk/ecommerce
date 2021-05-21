import { Button } from "antd";
import React from "react";

const CategoryForm = ({ handleSubmit, name, setName }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Name</label>
      <input
        type="text"
        className="form-control col-md-6 col-sm-6"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        required
      />
      <br />
      <Button 
          onClick={handleSubmit}
            type="primary"
            shape="round"
            size="large"        
            >SAVE</Button>
    </div>
  </form>
);

export default CategoryForm;
