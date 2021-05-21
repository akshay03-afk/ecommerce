import React, {useState, useEffect} from 'react'
import SingleProduct from '../components/cards/SingleProduct';
import { getProduct, productStar } from "../functions/product";
import { useSelector } from "react-redux";
import {getRelated} from "../functions/product";
import ProductCard from "../components/cards/ProductCard";

const Product = ({match}) => {
    const { user } = useSelector((state) => ({...state}));    
    const [product, setProduct] = useState({});
    const [star, setStar] = useState(0);
    const [related, setRelated] = useState([])
    const { slug } = match.params;

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);
    
    

    useEffect(() =>{
        if(product.rating && user){
            let existingRatingObject = product.rating.find(
                (ele) => ele.postedBy.toString() === user._id.toString()
              );
              existingRatingObject && setStar(existingRatingObject.star) //current user star
        }    
    })
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])
      
    const loadSingleProduct = () =>{
        getProduct(slug)
        .then(res =>{
            setProduct(res.data);
            //load related
            getRelated(res.data._id)
            .then(res =>{
                setRelated(res.data)
            })
        })
    }
    const onStarClick = (newRating, name) =>{
        setStar(newRating);
        //console.log(newRating, name);
        productStar(name, newRating, user.token)
        .then(res => {
            console.log(res.data);
            loadSingleProduct();
        })
    }

    return (
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct product={product} onStarClick= {onStarClick} star={star} />

            </div>

            <div className="row">
                <div className="col text-center pt-5 pb-5">
                    <hr />
                        <h4>
                            Related Products
                        </h4>
                    <hr />
                </div>    
            </div>
            <div className="container">
            <div className="row">
                {related.length > 0 ? related.map((r) =>( 
                    <div className="col-md-4" key={r._id}>
                        <ProductCard product={r}/>
                    </div>
                )) : <div className="col text-center mb-5">
                        "NO PRODUCT FOUND"
                    </div> }
            </div>
            </div>
        </div>
    )
}

export default Product;
