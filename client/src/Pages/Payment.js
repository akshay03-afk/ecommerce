import React from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";
import "../stripe.css";


const promise = loadStripe(process.env.REACT_APP_SECRET_KEY);

const Payment = () => {
    return (
        <div className="container p-5 text-center">
            <h4 className="display-4">Complete your Purchase</h4>
            <p>Note: For testing purpose use card number 4242 4242 4242 4242 </p>
            <hr className="col-md-6" />
            <Elements stripe={promise}>
                <div className="col-md-8 offset-md-2">
                    <StripeCheckout />
                </div>
            </Elements>
        </div>
    )
}

export default Payment;
