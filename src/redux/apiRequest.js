import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { getUsersFailed, getUsersSuccess, getusersStart , deleteUserStart,deleteUserSuccess,deleteUserFailed } from "./userSlice";

const apiURL = process.env.REACT_APP_API_URL
// login
export const loginUserAdmin = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${apiURL}/v1/auth/login`, user,{
            withCredentials: true
        })
            dispatch(loginSuccess(res.data))
            navigate("/train")
    } catch (error) {
        dispatch(loginFailed())
    }
}
//register
export const registerUser = async(user,dispatch,navigate) => {
    dispatch(registerStart())
    try {
        await axios.post(`${apiURL}/v1/auth/register`,user)
        dispatch(registerSuccess())
        navigate("/")
    } catch (error) {
        dispatch(registerFailed())
    }
}
//getalluser
export const getAllusers = async(accessToken, dispatch ,axiosJWT) =>{
    dispatch(getusersStart())
    try {
        const res = await axiosJWT.get(`${apiURL}/v1/user`,{
            headers:{token:`Bearer ${accessToken}`}
        });
        dispatch(getUsersSuccess(res.data))
    } catch (error) {
        dispatch(getUsersFailed())
    }
}
//deleteUser
export const deleteUser = async(accessToken, dispatch, id , axiosJWT) =>{
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete(`${apiURL}/v1/user/`+id,{
            headers:{token:`Bearer ${accessToken}`}
        });
        dispatch(deleteUserSuccess(res.data))
    } catch (error) {
        dispatch(deleteUserFailed(error.response.data))
    }
}


//logout
export const logoutUser = async(dispatch,id,navigate,accessToken,axiosJWT) =>{
    dispatch(logoutStart())
    try {
        await axiosJWT.post(`${apiURL}/v1/auth/logout`,id,{
            headers:{token:`Bearer ${accessToken}`}
        })
        dispatch(logoutSuccess())
        navigate("/")
    } catch (error) {
        dispatch(logoutFailed())
    }
}