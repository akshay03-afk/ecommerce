import React ,{useState, useEffect} from 'react';
import { fetchProductsByFilter, getProductsByCount } from "../functions/product";
import { useSelector, useDispatch} from "react-redux";
import { getCategories }  from "../functions/category";
import { getSubCategories } from "../functions/subCategory"; 
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import { BgColorsOutlined, CarryOutOutlined, DollarOutlined, DownSquareOutlined, StarOutlined, SwapOutlined, TagsOutlined } from "@ant-design/icons";
import Stars from "../components/form/Stars";
import Loader from "../components/Loader";

const { SubMenu} = Menu;

const Shop = () => {
    let dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0,0]);
    const [ok, setOk] = useState(false);
    //show categories
    const [categories, setCategories] = useState([]);
    //to select category
    const [categoryIds, setCategoryIds] = useState([]);

    //stars
    const [star, setStar] = useState("");

    //show sub categories
    const [subCategories, setSubCategories] = useState([]);
    const [subCategory, setSubCategory] = useState("");

    //brand
    const [brands, setBrands] = useState([
        "Apple", 
        "Samsung", 
        "Microsoft", 
        "Lenovo", 
        "Asus", 
        "HP", 
        "Alienware", 
        "Acer", 
        "Amazon Basics", 
        "Sony", 
        "TCL",
        "LG",
        "MIVI",
        "Amazon",
        "Noise",
        "JBL",
        "Beats",
        "Google",
        "OnePlus",
        "Moto",
        "Vivo",
        "Dell",
        "cosmicBytes",
        "RedGear",
        "Razor",
        "Logitech",
        "Corsair",
        "WD",
        "Seagate",
        "Others"
    ]);
    const [brand, setBrand] = useState("");

    const [colors, setColors] = useState([
        "Black", "Brown", "Silver", "White", "Blue", "Gold", "Yellow", "Purple", "Red", "Grey"
    ])
    const [color, setColor] = useState("")

    const [shipping, setShipping] = useState(""); 
    let { search } = useSelector((state) => ({...state}));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        //categories
        getCategories()
        .then(res =>{
            //console.log(res.data);
            setCategories(res.data);
        })
        //sub categories
        getSubCategories()
        .then(res =>{
            setSubCategories(res.data);
            //console.log(res.data);
        })

    }, [])

    const fetchProducts = (arg) =>{
        fetchProductsByFilter(arg)
        .then(res =>{
            setProducts(res.data);
            //console.log(res.data)
        })
    } 

    //1. load  products by defaulr on page load
    const loadAllProducts = () =>{
        getProductsByCount(6)
        .then(res =>{
            setProducts(res.data);
            setLoading(false);
        })
    }

    //2. load products on user search input

    useEffect(() => {
        const delayed = setTimeout(()=>{
            fetchProducts({query: text});
            if(!text){
                loadAllProducts()
            }
        }, 300);
        return () => clearTimeout(delayed);
    }, [text])

    

    //3. load products based on price range
    useEffect(() => {
        fetchProducts({price}); 
    }, [ok])

    const handleSlider = (value) =>{
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text : "" }
        });
        setCategoryIds([]);
        setPrice(value);
        setStar("")
        setSubCategory("")
        setBrand("")
        setColor("")
        setShipping("")
        setTimeout(() =>{
            setOk(!ok)
        },300)
    }

    const handleClick = (e) =>{
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text : "" }
        })
        setPrice([0,0]);
        setStar("")
        setSubCategory("")
        setBrand("")
        setColor("")
        setShipping("")
        // console.log(e.target.value);
        let inTheState = [...categoryIds];
        //console.log(inTheState)
        let justChecked = e.target.value;
        let foundIntheState = inTheState.indexOf(justChecked) //index oe -1

        if(foundIntheState === -1){
            inTheState.push(justChecked);
        }else{
            //if found pull out one item from index
            inTheState.splice(foundIntheState, 1);
        }
        setCategoryIds(inTheState);
        //console.log(inTheState);
        fetchProducts({category: inTheState}) 
    }
    //5. products by Star rating
    
    const handleStarClick = (num)=>{
        //console.log(num)
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text : "" }
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setSubCategory("")
        setStar(num);
        setBrand("")
        setColor("")
        setShipping("")
        fetchProducts({stars: num});
    }

    const showStars= () => (
        <div className="pr-4 pl-4 pb-2">
            <Stars 
                starClick={handleStarClick}
                numberOfStars={5}
            /><br />
            <Stars 
                starClick={handleStarClick}
                numberOfStars={4}
            /><br /> 
            <Stars 
                starClick={handleStarClick}
                numberOfStars={3}
            /> <br />
            <Stars 
                starClick={handleStarClick}
                numberOfStars={2}
            /> <br />
            <Stars 
                starClick={handleStarClick}
                numberOfStars={1}
            /> 
        </div>
    )
    
    //6. show products by sub categories
    const handleSubmit = (sub) =>{
        //console.log("Sub", sub);
        setSubCategory(sub);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text : "" }
        })
        setPrice([0,0]);
        setCategoryIds([]);
        setStar("");
        setSubCategory("")
        setBrand("");
        setColor("");
        setShipping("")
        fetchProducts({subCategory : sub})   
        //console.log({subCategory : sub})
    }

    const showSubs = () =>
        subCategories.map((s) =>(
            <div 
                key={s._id}
                className="p-1 m-1 badge badge-secondary"
                onClick={() => handleSubmit(s)}
                style={{cursor: "pointer"}}    
            >
                {s.name}
            </div>
        ))

    //7. show products based on brands name
    const showBrands = () =>
        brands.map((b) =>
            <Radio
                key={b}
                value={b}
                name={b}
                checked={b === brand}
                onChange={handleBrand}
                className="pb-1 pl-4 pr-4"
            >
            {b}
            </Radio>
        )

        const handleBrand = (e) =>{
            dispatch({
                type: "SEARCH_QUERY",
                payload: { text : "" }
            })
            setPrice([0,0]);
            setCategoryIds([]);
            setStar("");
            setSubCategory("")
            setColor("")
            setShipping("")
            setBrand(e.target.value);
            fetchProducts({ brand : e.target.value})    
            
        }
        //8.show colors
        const showColors = () =>
            colors.map((c) =>
            <Radio
                key={c}
                value={c}
                name={c}
                checked={c === color}
                onChange={handleColor}
                className="pb-1 pl-4 pr-4"
            >
            {c}
            </Radio>
        )

        const handleColor = (e) =>{
            dispatch({
                type: "SEARCH_QUERY",
                payload: { text : "" }
            })
            setPrice([0,0]);
            setCategoryIds([]);
            setStar("");
            setBrand("");
            setSubCategory("")
            setShipping("")
            setColor(e.target.value)
            //console.log(e.target.value)
            fetchProducts({ color : e.target.value})
        }
        //9.show shipping

        const handleShippingChange = (e) =>{
            dispatch({
                type: "SEARCH_QUERY",
                payload: { text : "" }
            })
            setPrice([0,0]);
            setCategoryIds([]);
            setStar("");
            setBrand("");
            setSubCategory("")
            setColor("")
            setShipping(e.target.value)
            //console.log(e.target.value)
            fetchProducts({ shipping : e.target.value})
        }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                        <h4 className="pt-3">Search/filter</h4>
                        <hr />

                    <Menu defaultOpenKeys={["1"]} mode="inline"> 
                        {/* //price */}
                        <SubMenu key="1" 
                                
                                title={
                                    <span className="h6">
                                        <DollarOutlined />
                                            Price
                                    </span>}>
                            <div>
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(v)=> `$${v}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="10000"
                                 />
                            </div>
                        </SubMenu>
                        {/* category */}
                        <SubMenu key="2" 
                                title={
                                    <span className="h6">
                                        <DownSquareOutlined />
                                            Categories
                                    </span>}>
                            <div style={{marginTop : "0", background: "white"}}>
                                {
                                    //4. Load products based on categories
                                    //show categories in a list of checkbox
                                    categories.map((c) =>(
                                        <div key={c._id}>
                                            <Checkbox 
                                                onChange={handleClick}
                                                className="pb-2 pl-4 pr-4"
                                                value={c._id}
                                                name="category"
                                                checked={categoryIds.includes(c._id)}    
                                            >
                                                {c.name}
                                            </Checkbox>
                                        </div>
                                    ))
                                }
                            </div>
                        </SubMenu>
                        {/* Rating */}
                        <SubMenu
                            key="3"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Rating
                                </span>
                            }
                            >
                            <div style={{marginTop : "0", background: "white"}} className="pr-4">
                                {showStars()}
                            </div>



                        </SubMenu>
                        {/* sub category */}
                        <SubMenu
                            key="4"
                            title={
                                <span className="h6">
                                    <CarryOutOutlined /> Sub Categories
                                </span>
                            }
                            >
                            <div style={{marginTop : "0", background: "white"}} className="pl-4 pr-4">
                                {showSubs()}
                            </div>
                        </SubMenu>
                        {/* brand */}
                        <SubMenu
                            key="5"
                            title={
                                <span className="h6">
                                    <TagsOutlined /> Brand
                                </span>
                            }
                            >
                            <div style={{marginTop : "0", background: "white"}} className="pr-4">
                                {showBrands()}
                            </div>
                        </SubMenu>
                        {/* color */}
                        <SubMenu
                            key="6"
                            title={
                                <span className="h6">
                                    <BgColorsOutlined /> Color
                                </span>
                            }
                            >
                            <div style={{marginTop : "0", background: "white"}} className="pr-4">
                                {showColors()}
                            </div>
                        </SubMenu>
                        {/* shipping */}
                        <SubMenu
                            key="7"
                            title={
                                <span className="h6">
                                    <SwapOutlined /> Shipping
                                </span>
                            }
                            >
                            <div style={{marginTop : "0", background: "white"}} className="pr-4">
                            
                            
                                        <Checkbox 
                                        className="pb-4 pl-4 pr-4"
                                        onChange={handleShippingChange}
                                        value="Yes"
                                        checked={shipping === "Yes"}>
                                            Yes
                                        </Checkbox>
                                        
                                        <Checkbox 
                                        className="pb-4 pl-4 pr-4"
                                        onChange={handleShippingChange}
                                        value="No"
                                        checked={shipping === "No"}>
                                            No
                                        </Checkbox>
                                        
                        
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                {
                    loading ? <Loader /> : (
                        <div className="col-md-9">
                        <h4 className="pt-3">Products</h4>
                
                    {products.length < 1 && <p>"No Products found</p>}
                    <div className="row">
                            {products.map((p) =>(
                                <div key={p._id} className="col-md-4">
                                    <ProductCard product={p}/>
                                </div>
                            ))}
                        </div>
                    </div> 
                    )
                }
                
                </div>
            </div>
    
    )
}

export default Shop;
