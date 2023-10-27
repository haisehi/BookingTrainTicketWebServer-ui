import classNames from "classnames/bind";
import styles from "./Register.module.scss"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiRequest";

function Register() {
    const [email, setEmail] = useState("")
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const newUser = {
            userName: userName,
            email:email,
            password: password
        }
        registerUser(newUser,dispatch,navigate)
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>User name</label>
                <input placeholder="User Name" type="tex" onChange={(e) => { setUsername(e.target.value) }} />
                <label>Email</label>
                <input placeholder="Email" type="tex" onChange={(e) => { setEmail(e.target.value) }} />
                <label>Password</label>
                <input placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                <button type="submit">Register</button>
            </form>
            <Link to="/">Login</Link>
        </div>
    );
}

export default Register;