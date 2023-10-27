import {Link, useNavigate} from 'react-router-dom'

import classNames from "classnames/bind";
import styles from "./sideBar.module.scss"
import { logoutUser } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles)


function SideBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut =() =>{
        logoutUser(dispatch,navigate)
    }

    return ( 
        <ul className={cx('nav_header')}>
        <Link className={cx('nav_header-items','home-active')} to='/train' ><li>Train</li></Link>
        <Link className={cx('nav_header-items')} to='/room' ><li>Room</li></Link>
        <Link className={cx('nav_header-items')} to='/station' ><li>Station</li></Link>
        <Link className={cx('nav_header-items')} to='/ticket' ><li>Ticket</li></Link>
        <Link className={cx('nav_header-items')} to='/customer' ><li>Customer</li></Link>
        <li><button className={cx('nav_header-btn')} onClick={handleLogOut}>Log out</button></li>
    </ul>
     );
}

export default SideBar;