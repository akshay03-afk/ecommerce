import React, {useState} from 'react';
import { Modal} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined} from "@ant-design/icons";
import { useHistory , useParams} from "react-router-dom";

const RatingModal = ({children}) => {
    let history = useHistory();
    let params = useParams();
    const { user } = useSelector((state) => ({...state}));
    const [modalVisible, setModalVisible] = useState(false);
    

    const handleModal = () =>{
        if(user && user.token){
            setModalVisible(true);

        }else{
            history.push({
                pathname:"/login",
                state: { from : `/product/${params.slug}`}
            });
        }
    }
    return (
        
        <>
            <div onClick={handleModal}>
                <StarOutlined className="text-danger" /><br />{" "}
                {user? "Leave Rating" : "Login to leave rating"}
            </div>
            <Modal 
                title="Leave your rating"
                centered
                visible={modalVisible}
                onOk={() => {
                    setModalVisible(false)
                    toast.success("Thanks for Your Review");
                    }
                }
                onCancel={() => setModalVisible(false)}
            >
                {children}
            </Modal>
        </>    
    )
}

export default RatingModal;
