import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState:{
        users:{
            allUsers: null,
            isFetching:false,
            error:false,
        },
        mgs:"",
    },
    reducers:{
        getusersStart:(state)=>{
            state.users.isFetching = true;
        },
        getUsersSuccess:(state,action)=>{
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFailed:(state)=>{
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart:(state)=>{
            state.users.isFetching = true;
        },
        deleteUserSuccess:(state,action)=>{
            state.users.isFetching = true;
            state.mgs = action.payload;
        },
        deleteUserFailed:(state,action)=>{
            state.users.isFetching = false;
            state.users.error = true;
            state.mgs = action.payload;
        }
    }
})

export const {
    getusersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed
} = userSlice.actions

export default userSlice.reducer