import { Link, useNavigate } from 'react-router-dom'
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from "classnames/bind";
import styles from "./sideBar.module.scss"
import { logoutUser } from '../../redux/apiRequest';
import { createAxios } from '../../createInstance';

const cx = classNames.bind(styles)


function SideBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.login.currentUser)
    const accessToken = user?.accessToken
    const id = user?._id
    let axiosJWT = createAxios(user,dispatch,logoutUser)

    const handleLogOut = () => {
        logoutUser(dispatch,id, navigate,accessToken,axiosJWT)
    }
    return (
        <ul className={cx('nav_header')}>
            {user ? (
                <Fragment>
                    <li className={cx('nav_header-items', 'home-active')}>{user.userName}</li>
                    <Link className={cx('nav_header-items', 'home-active')} to='/train' ><li>Train</li></Link>
                    <Link className={cx('nav_header-items')} to='/room' ><li>Room</li></Link>
                    <Link className={cx('nav_header-items')} to='/station' ><li>Station</li></Link>
                    <Link className={cx('nav_header-items')} to='/ticket' ><li>Ticket</li></Link>
                    <Link className={cx('nav_header-items')} to='/customer' ><li>Customer</li></Link>
                    <Link className={cx('nav_header-items')} to='/userAdmin' ><li>User</li></Link>
                    <li><button className={cx('nav_header-btn')} onClick={handleLogOut}>Log out</button></li>
                </Fragment>
            ) : (
                <Fragment>
                    <Link className={cx('nav_header-items', 'home-active')} to='/train' ><li>Train</li></Link>
                    <Link className={cx('nav_header-items')} to='/room' ><li>Room</li></Link>
                    <Link className={cx('nav_header-items')} to='/station' ><li>Station</li></Link>
                    <Link className={cx('nav_header-items')} to='/ticket' ><li>Ticket</li></Link>
                    <Link className={cx('nav_header-items')} to='/customer' ><li>Customer</li></Link>
                    <Link className={cx('nav_header-items')} to='/userAdmin' ><li>User</li></Link>
                    <li><button className={cx('nav_header-btn')} onClick={handleLogOut}>Log out</button></li>
                </Fragment>
            )}
        </ul>
    );
}

export default SideBar;