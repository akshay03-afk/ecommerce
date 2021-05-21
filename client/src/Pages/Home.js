import React from 'react'
import BestSellers from '../components/home/BestSellers';
import NewArrivals from '../components/home/NewArrivals';
// import CategoryList from "../components/category/CategoryList";
// import SubCategoryList from '../components/sub/SubCategoryList';
import Carausel from '../components/home/Carausel';

const Home = () => {
    return (
        <>
        <Carausel/>
        <div className="row">
            <h4 className="col-md-2 mt-3 mb-5 ml-3 p-2 jumbotron text-center display-4 new-arrival">New Arrivals</h4>
        </div>
        <NewArrivals  />
        <div className="row">
            <h4 className="col-md-2 mt-3 mb-5 ml-3 p-2 jumbotron text-center display-4">Best Sellers</h4>
        </div>
        <BestSellers />
        {/* <div className="row">
            <h4 className="col-md-2 mt-3 mb-5 ml-3 p-2 jumbotron  text-center display-4">Category</h4>
        </div>
        <CategoryList />
        <div className="row">
            <h4 className="col-md-2 mt-5 mb-5 ml-3 p-2 jumbotron text-center display-4">Sub Category</h4>
        </div>
        <SubCategoryList /> */}
        
        </>
    )
}

export default Home;
