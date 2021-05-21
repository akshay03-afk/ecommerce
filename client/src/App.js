import React , {useEffect, lazy, Suspense} from "react";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css'; 
import { Switch , Route} from "react-router-dom";
import { auth } from  "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./functions/auth";
import { LoadingOutlined } from "@ant-design/icons";

const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));  
const Login = lazy(() => import("./Pages/Auth/Login"));
const Register = lazy(() => import("./Pages/Auth/Register"));
const Home = lazy(() => import( "./Pages/Home"));
const Header = lazy(() => import("./components/nav/Header")); 
const RegisterComplete = lazy(() => import('./Pages/Auth/RegisterComplete'));
const History = lazy(() => import("./Pages/user/History"));
const Password = lazy(() => import("./Pages/user/Password"));
const Wishlist = lazy(() => import("./Pages/user/Wishlist"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const AdminDashbaord = lazy(() => import("./Pages/admin/AdminDashbaord")) ;
const CategoryCreate = lazy(() => import("./Pages/admin/category/CategoryCreate")) ;
const CategoryUpdate = lazy(() => import("./Pages/admin/category/CategoryUpdate")) ;
const SubCreate = lazy(() => import("./Pages/admin/subCategory/SubCreate"));
const SubUpdate = lazy(() => import("./Pages/admin/subCategory/SubUpdate")) ;
const ProductCreate = lazy(() => import("./Pages/admin/product/ProductCreate")) ;
const AllProduct = lazy(() => import("./Pages/admin/product/AllProduct")) ;
const ProductUpdate = lazy(() => import("./Pages/admin/product/ProductUpdate")) ;
const Product = lazy(() => import("./Pages/Product")) ;
const CategoryHome = lazy(() => import("./Pages/category/CategoryHome"));
const SubCategoryHome = lazy(() => import("./Pages/sub/SubCategoryHome"));
const Shop = lazy(() => import("./Pages/Shop"));
const Cart = lazy(() => import("./Pages/Cart")); 
const Checkout = lazy(() => import("./Pages/Checkout"));
const CreateCoupon = lazy(() => import("./Pages/admin/coupon/CreateCoupon"));
const ForgotPassword = lazy(() => import("./Pages/Auth/ForgotPassword"));
const Payment = lazy(() => import("./Pages/Payment"));




const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged( async (user) => {
        if(user){
          const idTokenResult = await user.getIdTokenResult();
          
          currentUser(idTokenResult.token)
          .then(res => {
              dispatch({
                  type: "LOGGED_IN_USER",
                  payload: {
                      name: res.data.name,
                      email : res.data.email,
                      token : idTokenResult.token,
                      role: res.data.role,
                      _id: res.data._id
                  }
             });
             
          })
          .catch(err => console.log(err));
          
        }
    })
    return () => unsubscribe();// eslint-disable-next-line 
  }, [])
  return (
    <Suspense fallback={
      <div className="col text-center p-5">
          __REACT EC<LoadingOutlined />MMERCE__
      </div>
    }>
      <Header />
      <SideDrawer />
      <ToastContainer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/complete" component={RegisterComplete} />
          <Route exact path="/forgot/password" component={ForgotPassword} />
          <UserRoute exact path="/user/history" component={History} />
          <UserRoute exact path="/user/password" component={Password} />
          <UserRoute exact path="/user/wishlist" component={Wishlist} />
          <UserRoute exact path="/payment" component={Payment} />
          <AdminRoute exact path="/admin/dashboard" component={AdminDashbaord} />
          <AdminRoute exact path="/admin/category" component={CategoryCreate} />
          <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate} />
          <AdminRoute exact path="/admin/sub" component={SubCreate} />
          <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
          <AdminRoute exact path="/admin/product" component={ProductCreate} />
          <AdminRoute exact path="/admin/products" component={AllProduct} />
          <AdminRoute exact path="/admin/coupon" component={CreateCoupon} />
          <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate} />
          <Route exact path="/product/:slug" component={Product} />
          <Route exact path="/category/:slug" component={CategoryHome} />
          <Route exact path="/sub/:slug" component={SubCategoryHome} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/checkout" component={Checkout} />

        </Switch>
    </Suspense>
  );
}

export default App;
