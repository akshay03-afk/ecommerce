import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import Loader from '../../components/Loader';
import { Button } from 'antd';

const ForgotPassword = ({history}) => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const {user} = useSelector((state) => ({ ...state }));

    useEffect(() => {
      if(user && user.token)  history.push("/");// eslint-disable-next-line 
    }, [user]);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
            handleCodeInApp: true
        }
        await auth.sendPasswordResetEmail(email, config)
        .then(() =>{
            setEmail("");
            setLoading(false);
            toast.success("Check your email for password reset link");

        }).catch((error) =>{
            setLoading(false);
            toast.error(error.message);
    });
    }
    return (
        <div className="container col-md-6 offset-md-3 p-5"> 
            {loading ? (<Loader className="text-center" /> ) : (
                <h4 className="text-center">Forgot Password?</h4>
            )}

            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    className="form-control"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                    autoFocus
                    />
                    <Button
                        onClick={handleSubmit}
                        className="mt-3"
                        type="primary"
                        block
                        shape="round"
                        size="large"
                        disabled={!email}>Submit</Button>
            </form>
        </div>
    )
}

export default ForgotPassword;