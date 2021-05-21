import React, {useState} from 'react';
import { Menu ,Badge} from 'antd';
import { AppstoreOutlined, UserOutlined, UserAddOutlined, LogoutOutlined, ShoppingOutlined , ShoppingCartOutlined, SolutionOutlined} from '@ant-design/icons';
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchForm from '../form/SearchForm';

const { SubMenu, Item } = Menu;

const Header = () => {
    let dispatch = useDispatch();
    let history = useHistory();
    let { user , cart} = useSelector((state) => state)
    const [current, setCurrent] = useState('home');

    const handleClick = (e) => {
        setCurrent(e.key);
    }

    const logout = () =>{
        firebase.auth().signOut();
        dispatch({
            type : "LOGOUT",
            payload : null
        });
        history.push("/login");
    }
    return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Item key="home" icon={<AppstoreOutlined />}>
            <Link to="/">
                Home
            </Link>
        </Item>
        <Item key="shop" icon={<ShoppingOutlined />} >
            <Link to="/shop">
                Shop
            </Link>
        </Item>
        <Item key="cart" icon={<ShoppingCartOutlined />}>
            <Link to="/cart">
                <Badge count={cart.length} offset={[9,0]}>
                    Cart
                </Badge>
            </Link>
        </Item>

        {!user && (
            <Item key="register" icon={<UserAddOutlined />} className="float-right">
                <Link to="/register">
                    Register
                </Link>
            </Item>
        )}
        
        {!user && (
            <Item key="login" icon={<UserOutlined />} className="float-right">
                <Link to="/login">
                    Login
                </Link>
            </Item>
        )}
        
        {user && (
            <SubMenu icon={<UserOutlined />} 
            title={user.email && user.email.split("@")[0]} 
            className = "float-right">
                {user && user.role === "subscriber" && <Item icon={<SolutionOutlined />} ><Link to="/user/history">Dashboard</Link></Item>}
                {user && user.role === "admin" && <Item icon={<SolutionOutlined />} ><Link to="/admin/dashboard">Dashboard</Link></Item>}
                
                <Item icon={<LogoutOutlined />} onClick={logout}>Logout </Item>
            </SubMenu>
        )}
        <span className="float-right p-1">
            <SearchForm />
        </span>
    </Menu>

    )
}

export default Header;

