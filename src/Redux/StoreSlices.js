import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const StoreSlice = createSlice({
    name: 'StoreSlice',
    initialState: {token: null , User: null},
    reducers: {
        
    }
})
export default StoreSlice.reducer;
export const {currentUser , removeUser} =  StoreSlice.actions;