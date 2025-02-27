import {toast} from "sonner";
import API from "../MainApi"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const login = async (user: any) => {
    try {
       const res =  await API.post('/auth/login', user);
       if (res.data) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        
       }
       
       return res.data;


    } catch (error) {
        throw new Error("something went wrong");
    }
}

const signUp = async (user: any) => {
    try {
        console.log('hello from sservice' , user);
        // const res =  await axios.post("http://localhost:8081/(api)/user", user);
        // const res = await fetch("/user", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(user),
        //   });
          const res = await API.post('/auth/create', user);
          console.log('data', res?.data);
          

        // const data = res.json();

        await AsyncStorage.setItem("user", JSON.stringify(res?.data));

      

        return res?.data;

    } catch (error: any) {
        console.log(error, 'errorserv');
        throw new Error(error);            
    }
}
// const createRide = async (data: any) => {
//     try {
//          const res = await API.put(`/user/addtoFavorites/${listingId}`);
//          return res?.data;
//     } catch(error) {
//         throw new Error("something went wrong");
//     }
// }

const getWishlist = async () => {
    try {
        const res = await API.get('/user/wishlist');
        if (res?.data) {
            return res?.data;
        }

    } catch (error) {
        throw new Error("something went wrong");
    }
}

const addListingToWishlist = async (listingId: string) => {
    try {
         const res = await API.put(`/user/addtoFavorites/${listingId}`);
         return res?.data;
    } catch(error) {
        throw new Error("something went wrong");
    }
}

const removeListingFromWishlist = async (listingId: string) => {
    try {
        const res = await API.delete(`/user/removefromFavorites/${listingId}`);
        return res?.data;
    } catch (error) {
        throw new Error("something went wrong");
    }
}

const logout = async () => {
    // localStorage.clear();
}

export default {login, signUp, logout, addListingToWishlist, removeListingFromWishlist, getWishlist};
