import classNames from "classnames/bind";
import styles from "./Login.module.scss"

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUserAdmin } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

function Login() {
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            userName: userName,
            password: password,
        };
        loginUserAdmin(newUser, dispatch, navigate)
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>User name</label>
                <input placeholder="userName" name="userName" type="tex" onChange={(e) => { setUsername(e.target.value) }} />
                <label>Password</label>
                <input placeholder="Password" name="password" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                <button type="submit">Login</button>
            </form>
            <Link to="/register">Register</Link>
        </div>
    );
}

export default Login;