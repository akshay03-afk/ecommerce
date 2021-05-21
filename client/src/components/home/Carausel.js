import React, {useState, useEffect } from 'react';
import { getProductsByCount } from "../../functions/product";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Carausel = () => {
    const [products, setProducts] = useState();

    useEffect(() => {
        getProductsByCount()
        .then(res =>{
            setProducts(res.data);
            //console.log(res.data)
        })    
    }, [])
    return (
        
        <Carousel showArrows={true} autoPlay infiniteLoop className="mt-2">
            {products && products.map((p) =>(
                <div key={p?._id}>
                    <img src={
                        p?.images[0].url
                    }
                    alt="" />
                </div>
            ))}   
        </Carousel>
    

    )
}

export default Carausel;
