import React, { useState } from 'react';
import UserNav from '../../components/nav/UserNav';
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from 'antd';


 const Password = () => {
     const [password, setPassword] = useState("");
     const [loading, setLoading] = useState(false);

     const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        await auth.currentUser.updatePassword(password)
        .then(() => {
            setLoading(false);
            toast.success("Password updated successfully");
            setPassword("")
        })
        .catch(err => toast.error(err.message));
     }

     const passwordUpdateForm  = () => (
         <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Your Password</label>
                <input 
                    type="password"
                    className="form-control col-md-3"
                    placeholder="Enter new Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoFocus
                />
                <Button 
                    type="primary" 
                    className="mt-2"
                    shape="round"
                    size="large"
                    disabled={!password || password.length<6 || loading }
                    >
                Submit
                </Button>
            </div>
         </form>
     )
     return (
         <div className="container-fluid">
             <div className="row">
                <div className="col-md-2">
                <UserNav />
                </div>
                 <div className="col">
                        {loading ? <h4 className="text-danger">Loading...</h4>: <h4 className="display-4 mt-2">Password Update</h4>}
                        {passwordUpdateForm()}
                 </div>
             </div>
         </div>
     )
 }
 
 export default Password;
 