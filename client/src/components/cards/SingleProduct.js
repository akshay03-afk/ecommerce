import React,{useEffect, useState} from 'react';
import {Card, Tabs, Tooltip} from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ProductListItem from './ProductListItem';
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from  "../../functions/rating";
import {useDispatch, useSelector } from  "react-redux";
import _ from "lodash";
import { addToWishList } from "../../functions/user";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
const { TabPane } = Tabs;

const SingleProduct = ({product, onStarClick, star}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {user, cart} = useSelector((state) => ({...state}));

    const [tooltip, setTooltip] = useState("Click To Add");

    const  {title, description, images, slug, _id} = product;

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

      const handleAddToCart = () =>{
        //create cart array
        let cart = [];
        if(typeof window !== "undefined"){
          //if cart is in localstorage get it
          if(localStorage.getItem("cart")){
            cart = JSON.parse(localStorage.getItem("cart"))
          }
          //push new Product to cart
          cart.push({
            ...product,
            count: 1
          });
          //remove duplicates
          let unique = _.uniqWith(cart, _.isEqual);
  
          //save to localstorage
          localStorage.setItem("cart", JSON.stringify(unique));
  
          setTooltip("Added");
  
          //add to redux state
          dispatch({
            type: "ADD_TO_CART",
            payload: unique,
          })
          //show the cart item in side drawer
          dispatch({
            type: "SET_VISIBILITY",
            payload: true
          })
        }
      }

      const handleAddToWishlist = (e) =>{
        e.preventDefault();
        addToWishList(product._id, user.token)
        .then(res =>{
          //console.log(res.data);
          toast.success("Added to Wishlist"); 
          history.push("/user/wishlist");
        })

      }
    return (
        <>
          <div className="col-md-7">
                <Carousel showArrows={true} autoPlay infiniteLoop>
                    {images && images.map((image)=> (
                        <img src={image.url} key={image.public_id } />
                    ))}
                </Carousel>
                {product && product.rating && product.rating.length > 0 ?
                      (
                          <h5 className="rating-model">Ratings: {showAverage(product)}</h5>
                      )  :
                           <h5 className="rating-model">Ratings: No ratings Yet!!</h5>
                    }               
          </div>
          <div className="col-md-5">
          <h3>{title}</h3>
            <Tabs className="mb-4" type="Card">
                <TabPane tab="Description" key="1">{description}</TabPane>
                <TabPane tab="More" key="2">Contact us <Link>akshaykumarchai1@gmail.com</Link></TabPane>

            </Tabs>
            <Card
                actions={[
                <>
                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCart} disabled={product.quantity<1}> 
                            <ShoppingCartOutlined className="text-primary"/> <br /> 
                            {product.quantity < 1 ? <p className="text-danger">Out of stock</p> : "Add to Cart"}
                        </a>                              
                    </Tooltip>
                </>,
                <a onClick={handleAddToWishlist}>
                    <HeartOutlined  className="text-danger"/> <br /> 
                    Add to wishlilst 
                </a>,
                 <RatingModal>
                    <StarRating 
                        name={_id}
                        numberOfStars={5}
                        rating={star} 
                        changeRating={onStarClick}
                        isSelectable={true}
                        starRatedColor="red"
                    />
                </RatingModal>
                ]}
                >
                <ProductListItem product={product}/>
            </Card>
            
          </div>  
        </>
    )
}

export default SingleProduct;
