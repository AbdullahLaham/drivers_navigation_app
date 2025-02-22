import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService';
import {toast} from 'sonner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../MainApi';

type stateType = {
    currentUser: any,
    listingAddedToWishlist: any,
    listingDeletedFromWishlist: any,
    wishlist: any,
    isError: Boolean,
    isLoading: Boolean,
    isSuccess: Boolean,
    message: String,
    error: string,
}
const getData = async (key: any) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error("Error retrieving data", e);
    }
  };
  
const user = getData('user');

const initialState: stateType = {
  currentUser:  user,
  listingAddedToWishlist: {},
  listingDeletedFromWishlist: {},
  wishlist: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  error: '',
  message: '',
}

export const login = createAsyncThunk('auth/login', async (user: any, thunkAPI) => {
  try {
    //   return await authService.login(user);
    const res =  await API.post('/auth/login', user);
    return res;

      
  } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message! || "حدث خطأ أثناء التسجيل");
  }

});


export const register = createAsyncThunk('auth/register', async (user: any, thunkAPI) => {
  try {
    // service code
    const res = await API.post('/auth/create', user);
    return res;

    //   return await authService.signUp(user);
      
      
  } catch (error: any) {

    const errorMessage = error?.response?.data?.message || "حدث خطأ أثناء التسجيل";
      console.log(errorMessage, 'errorMessage' );
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "حدث خطأ أثناء التسجيل");
  }

})

export const logout = createAsyncThunk('auth/logout', async (thunkAPI) => {
  try {

      return await authService.logout();
      
  } catch (error) {
    throw new Error("something went wrong");
  }

})
export const getWishlist = createAsyncThunk('auth/getWishlist', async (thunkAPI) => {
    try {
        return await authService.getWishlist();
    } catch (error) {
        throw new Error("something went wrong");
    }
});
export const addListingToWishlist = createAsyncThunk('auth/addListingToWishlist', async (listingId: string, thunkAPI) => {
    try {
        return await authService.addListingToWishlist(listingId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteListingFromWishlist = createAsyncThunk('auth/removeListingFromWishlist', async (listingId: string, thunkAPI) => {
    try {
        return await authService.removeListingFromWishlist(listingId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    

  },
  extraReducers: (builder) => {
     builder

    .addCase(login.pending,(state) => {state.isLoading = true }  )
    
    
    .addCase(login.fulfilled,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = false ;
        state.isSuccess = true;
        state.currentUser = action?.payload;
        state.error = '';
        if (state?.isSuccess) {
            toast.success("user entered successfully");
        }
    })

    .addCase(login.rejected,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = true;
        state.isSuccess = false;
        state.currentUser = null;
        state.error = action.payload;
        if (state?.isError) {
            toast.error("something went wrong");
        }
        // state.message = action.error;
    })




    .addCase(register.pending,(state) => {state.isLoading = true }  )
    
    
    .addCase(register.fulfilled,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = false ;
        state.isSuccess = true;
        state.currentUser = action?.payload;
        state.error  = '';
        if (state?.isSuccess) {
            // toast.success("user created successfully, please Login");
        }
    })

    .addCase(register.rejected,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = true;
        state.isSuccess = false;
        state.currentUser = null;
        state.error = action.payload;
        if (state?.isError) {
            toast.error("something went wrong");

        }
        // state.message = action.error;
    })


    .addCase(logout.pending,(state) => {state.isLoading = true }  )
    
    
    .addCase(logout.fulfilled,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = false ;
        state.isSuccess = true;
        state.currentUser = null;
    })

    .addCase(logout.rejected,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = true;
        state.isSuccess = false;
        state.currentUser = null;
        // state.message = action.error;
    })

    .addCase(getWishlist.pending,(state) => {state.isLoading = true }  )
    
    
    .addCase(getWishlist.fulfilled,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = false ;
        state.isSuccess = true;
        state.wishlist = action?.payload;
    })

    .addCase(getWishlist.rejected,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = true;
        state.isSuccess = false;
        // state.message = action.error;
    })


    .addCase(addListingToWishlist.pending,(state) => {state.isLoading = true }  )
    
    
    .addCase(addListingToWishlist.fulfilled,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = false ;
        state.isSuccess = true;
        state.currentUser = action?.payload;
        toast.success('Added To Wishlist Successfully');
    })

    .addCase(addListingToWishlist.rejected,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = true;
        state.isSuccess = false;
        toast.error("something went wrong");
        // state.message = action.error;
    })


    .addCase(deleteListingFromWishlist.pending,(state) => {state.isLoading = true }  )
    
    
    .addCase(deleteListingFromWishlist.fulfilled,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = false ;
        state.isSuccess = true;
        state.currentUser = action?.payload;
        toast.success('Deleted From Wishlist Successfully');
    })

    .addCase(deleteListingFromWishlist.rejected,(state, action: PayloadAction<any>) => {
        state.isLoading = false ;
        state.isError = true;
        state.isSuccess = false;
        toast.error("something went wrong");
        // state.message = action.error;
    })


    

  }
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = authSlice.actions

export default authSlice.reducer;

