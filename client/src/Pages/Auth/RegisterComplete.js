import React, {useState, useEffect} from 'react';
import {auth} from "../../firebase";
import { toast } from 'react-toastify';
import { useDispatch, useSelector} from "react-redux";
import {createOrUpdateUser} from "../../functions/auth";
import { Button } from 'antd';
import Loader from '../../components/Loader';

const RegisterComplete = ({history}) => {
    let dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); //eslint-disable-next-line 
    const {user} = useSelector((state) => ({...state}));
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        setEmail(window.localStorage.getItem("emailForRegistration"));

    }, [])

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(!email || !password){
            toast.error("Email and Password is required");
            return;
        }
        if(password.length<6){
            toast.error("Password must be atleast 6 characters");
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            
            if(result.user.emailVerified){
                //remove user email from storage
                window.localStorage.removeItem("emailForRegistration");
                //get user id token
                let user = auth.currentUser;
                await user.updatePassword(password);
                
                const idTokenResult = await user.getIdTokenResult();
                
                //console.log(user, email, idTokenResult);
                //redux store

                createOrUpdateUser(idTokenResult.token)
                .then(res => {
                    dispatch({
                        type: "LOGGED_IN_USER",
                        payload: {
                            name: res.data.name,
                            email : res.data.email,
                            token : idTokenResult.token,
                            role: res.data.role,
                            _id: res.data._id
                        }
                   });
                   
                })
                .catch(err => console.log(err));
                //redirect
                history.push("/")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
       
    };

    const completeResgisterForm = () => <form onSubmit={handleSubmit}>
        <input type="email" className="form-control" value={email} disabled/>
        <input type="password" className="form-control mt-3" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} autoFocus/>
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
                {loading ? (<Loader className="text-center" /> ) : (
                <h4 className="text-center">Register Complete</h4> )}
                    
                    {completeResgisterForm()}
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete;
