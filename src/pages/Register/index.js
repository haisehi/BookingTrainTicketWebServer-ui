import classNames from "classnames/bind";
import styles from "./Register.module.scss"; // Import file SCSS của trang đăng ký

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

const cx = classNames.bind(styles);

function Register() {
    const [userName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            userName: userName,
            email: email,
            password: password,
        };
        registerUser(newUser, dispatch, navigate);
    }

    return (
        <div className={cx('register-container')}>
            <form className={cx('register-form')} onSubmit={handleSubmit}>
                <h2>Register</h2>
                <label className={cx('register-label')}>User name</label>
                <input
                    className={cx('register-input')}
                    placeholder="User Name"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label className={cx('register-label')}>Email</label>
                <input
                    className={cx('register-input')}
                    placeholder="Email"
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className={cx('register-label')}>Password</label>
                <input
                    className={cx('register-input')}
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={cx('register-button')} type="submit">
                    Register
                </button>
                <Link to="/" className={cx('register-link')}><button className={cx('register-button')} >Login</button></Link>
            </form>
        </div>
    );
}

export default Register;
