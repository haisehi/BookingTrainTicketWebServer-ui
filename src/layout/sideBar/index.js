import {Link} from 'react-router-dom'

import classNames from "classnames/bind";
import styles from "./sideBar.module.scss"

const cx = classNames.bind(styles)


function SideBar() {
    return ( 
        <ul className={cx('nav_header')}>
        <Link className={cx('nav_header-items','home-active')} to='/' ><li>Train</li></Link>
        <Link className={cx('nav_header-items')} to='/room' ><li>Room</li></Link>
        <Link className={cx('nav_header-items')} to='/chair' ><li>Chair</li></Link>
        <Link className={cx('nav_header-items')} to='/ticket' ><li>Ticket</li></Link>
        <Link className={cx('nav_header-items')} to='/customer' ><li>Customer</li></Link>
        <li><button className={cx('nav_header-btn')} >Log out</button></li>
    </ul>
     );
}

export default SideBar;