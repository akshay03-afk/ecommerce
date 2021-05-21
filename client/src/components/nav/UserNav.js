import React from 'react';
import { Link } from "react-router-dom";
import { UnorderedListOutlined, UserSwitchOutlined, HeartOutlined } from "@ant-design/icons"
const UserNav = () => {
    return (
        <div className="nav flex-column">
            <li className="nav-item">
                <Link to="/user/history" className="nav-link"><UnorderedListOutlined /> History</Link>
            </li>
            <li className="nav-item">
                <Link to="/user/password" className="nav-link"><UserSwitchOutlined /> Password</Link>
            </li>
            <li className="nav-item">
                <Link to="/user/wishlist" className="nav-link"><HeartOutlined /> Wishlist </Link>
            </li>
        </div>
    )
}

export default UserNav;
