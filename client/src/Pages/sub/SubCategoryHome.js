import React, {useState, useEffect} from 'react';
import { getSubCategory } from "../../functions/subCategory";
import ProductCard from "../../components/cards/ProductCard";
import Loader from '../../components/Loader';



const SubCategoryHome = ({match}) => {
    const { slug } = match.params;
    const [sub, setSub] = useState({});
    const [ products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubCategory(slug)
       .then((res) =>{
            //console.log(JSON.stringify(res.data, null, 4))
            setSub(res.data.sub);
            setProducts(res.data.products);
            setLoading(false);
       }) 
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {loading ? (
                        <Loader />
                    ) : (
                        <h4 className=" text-center jumbotron mt-5 mb-5 display-4 p-2">{products.length} Products in "{sub.name}" Sub Category</h4>
                    )}
                </div>
            </div>
            <div className="row">
                {products.map((p) =>(
                    <div key={products._id} className="col-md-4">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubCategoryHome;
