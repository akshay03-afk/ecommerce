import React from 'react';
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Avatar, Badge } from "antd";
import { useSelector } from "react-redux";

const FileUpload = ({values, setValues, setLoading}) => {

    const { user } = useSelector((state) => ({...state})); 

    const FileUploadAndResize = (e) =>{
        //console.log(e.target.files);
        //resize
        let files = e.target.files;
        let allUploadedFiles = values.images;
        if(files){
            setLoading(true);
            for(let i=0;i<files.length;i++){
                Resizer.imageFileResizer(files[i], 720, 720, "JPEG" , 100 ,0, (uri) =>{
                    axios.post(`${process.env.REACT_APP_API}/uploadimages`, {image: uri}, {
                        headers : {
                            authtoken: user ? user.token : "",
                        }
                    })
                    .then(res => {
                        //console.log("Images response data", res);
                        setLoading(false);
                        allUploadedFiles.push(res.data);
                        setValues({...values, images :allUploadedFiles});
                    })
                    .catch(err =>{
                        setLoading(false);
                        console.log("cloudinary upload errror");
                    })

                },
                "base64"
                );

            }
        }

        //send back to cloudinary
        //set url to images in product create
    }
    const handleImageRemove = (public_id) =>{
        setLoading(true);
        //console.log("remove image", public_id);
        axios.post(`${process.env.REACT_APP_API}/removeimage`, {public_id}, {
            headers: {
                authtoken: user ? user.token : "", 
            }
        })
        .then(res => {
            setLoading(false);
            const {images} = values;
            let filteredImages = images.filter((item) =>{
                return item.public_id !== public_id
            });
            setValues({...values, images: filteredImages})

        })
        .catch(err =>{
            console.log(err);
            setLoading(false);
        })
    }

    return (
        <>
        <div className="row">
            {values.images && 
                values.images.map(image=>(
                    <Badge 
                        count="X" 
                        key={image.public_id} 
                        onClick={() => handleImageRemove(image.public_id)}
                        style={{cursor: "pointer"}}
                        >
                        <Avatar 
                            className="ml-3"
                            src={image.url}
                            shape="square" 
                            size={100}
                            
                        />
                    </Badge>
                )) 
            }
        </div>
        <div className="row mt-3">
            <label className="btn btn-primary btn-raised">Choose Images  
            <input 
                type="file" multiple hidden
                accept="images/*" 
                onChange={FileUploadAndResize}
             />
             </label>
        </div>
        </>
    )
}

export default FileUpload;
