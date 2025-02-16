import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { toast } from "sonner";

const API = axios.create({ baseURL: 'https://malltoall.mahmoudalbatran.com' });

const getData = async (key) => {
  try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
  } catch (e) {
      console.error("Error retrieving data", e);
  }
};

const user = getData('auth');

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // فك تشفير الجزء الخاص بالبيانات
    const currentTime = Math.floor(Date.now() / 1000);    // الوقت الحالي بالثواني
    return payload.exp < currentTime;                     // تحقق من انتهاء الصلاحية
  } catch (error) {
    return true; // إذا كان هناك خطأ في فك التشفير، نعتبر أن الـ Token منتهي الصلاحية
  }
}
function checkAndRemoveUser() {
  const user = getData('auth');
  
  if (user && user.token) {
    if (isTokenExpired(user.token)) {
      // localStorage.removeItem('auth'); // حذف بيانات المستخدم
      console.log('تم حذف المستخدم لأن صلاحية الـ Token انتهت.');
    } else {
      console.log('الـ Token لا يزال صالحًا.');
    }
  }
}


API.interceptors.request.use((req) => {
    if (getData('auth')) {
        req.headers.authorization = `Bearer ${user.token}`;
    }
    checkAndRemoveUser();
    return req;
});

API.interceptors.response.use(
    response => response,
    error => {
      // const { config, status, data: {message} } = error.response;
      // const originalRequest = config;

      

      
    //   const refreshToken = localStorage.getItem(refreshTokenKey);
    //   if (status === 401) {
    //     return apiRefreshAccessToken(refreshToken)
    //       .then(response => {
    //         localStorage.setItem(accessTokenKey, response.data.access_token);
    //         return axios(originalRequest);
    //       })
    //       .catch(err => {
    //         configureStore().dispatch(logout());
    //         return err;
    //       });
    //   }




      // if (status == 500 && message == "Token is Expires, Please Login again") {
      //   toast.error("Token is Expires, Please Login again");
      //   localStorage.clear();

      // }
    // console.log(error.response, status, 'ttttttttttttttttttt')
      return Promise.reject(error);
    },
  );
export default API;
