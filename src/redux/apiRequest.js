import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";

const apiURL = process.env.REACT_APP_API_URL
export const loginUserAdmin = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${apiURL}/v1/auth/login`, user)
            dispatch(loginSuccess(res.data))
            navigate("/train")
    } catch (error) {
        dispatch(loginFailed())
    }
}

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

export const logoutUser = async(dispatch,navigate) =>{
    dispatch(logoutStart())
    try {
        await axios.post(`${apiURL}/v1/auth/logout`,)
        dispatch(logoutSuccess())
        navigate("/")
    } catch (error) {
        dispatch(logoutFailed())
    }
}