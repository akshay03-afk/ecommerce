import axios from "axios";

export const createOrUpdateUser = async (authtoken) =>{
    return await axios.post(`https://ecommerce-web1.herokuapp.com/create-or-update-user`, {}, {
        headers: {
            authtoken
        }
    });
}

export const currentUser = async (authtoken) =>{
    return await axios.post(`https://ecommerce-web1.herokuapp.com/current-user`, {}, {
        headers: {
            authtoken
        }
    });
}

export const currentAdmin = async (authtoken) =>{
    return await axios.post(`https://ecommerce-web1.herokuapp.com/current-admin`, {}, {
        headers: {
            authtoken
        }
    });
}