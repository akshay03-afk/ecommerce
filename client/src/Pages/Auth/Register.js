import React, {useState, useEffect} from 'react';
import {auth} from "../../firebase";
import { toast } from 'react-toastify';
import {useSelector } from "react-redux";
import { Button } from 'antd';
import Loader from '../../components/Loader';



const Register = ({history}) => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const {user} = useSelector((state) => ({ ...state }));

    useEffect(() => {
      if(user && user.token)  history.push("/");// eslint-disable-next-line 
    }, [user, history]);
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true
        }
        await auth.sendSignInLinkToEmail(email, config);
        toast.success(`Email is sent to ${email}. Click the link to complete the registration`);
        
        //save email to localstorage
        window.localStorage.setItem("emailForRegistration", email);

        setEmail("");
    };

    const registerForm = () => <form onSubmit={handleSubmit}>
        <input type="email" className="form-control" placeholder="Enter valid email address" value={email} onChange={e => setEmail(e.target.value)} autoFocus/>
        <Button 
            onClick={handleSubmit}
            type="primary" 
            className="mb-3 mt-3"
            block
            shape="round"
            size="large"
         
        >
        Register
        </Button>
        

    </form>

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? <Loader className="text-center" /> : (<h4 className="text-center">Register</h4>)}
                    
                    {registerForm()}
                </div>
            </div>
        </div>
    )
}

export default Register;
