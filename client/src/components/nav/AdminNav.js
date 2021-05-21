import { AreaChartOutlined, CarryOutOutlined, DownSquareOutlined, GiftOutlined, PlusCircleOutlined, SolutionOutlined, UserSwitchOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from "react-router-dom";

const AdminNav = () => {
    return (
        <div className="nav flex-column">
            <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link"><SolutionOutlined /> Dashbaord</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/product" className="nav-link"><PlusCircleOutlined /> Create Product</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/products" className="nav-link"><AreaChartOutlined /> Products</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/category" className="nav-link"><DownSquareOutlined /> Category</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/sub" className="nav-link"><CarryOutOutlined /> Sub Category</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/coupon" className="nav-link"><GiftOutlined /> Coupon</Link>
            </li>
            <li className="nav-item">
                <Link to="/user/password" className="nav-link"><UserSwitchOutlined /> Password</Link>
            </li>
        </div>
    )
}

export default AdminNav;
