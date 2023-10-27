import classNames from "classnames/bind";
import styles from "./header.module.scss"
import { useSelector } from "react-redux";


const cx = classNames.bind(styles)

function Header() {
    const user = useSelector((state)=>state.auth.login.currentUser)
    return (
        <div className={cx('wrapper_header')}>
            <div className={cx('img_header')}>
                <img src='https://th.bing.com/th/id/OIP.0UQaGVOAYyykB5EI83s8YwHaF7?pid=ImgDet&rs=1' alt='logo' />
            </div>
            <ul className={cx('nav_header')}>
                {user ? (
                    <>
                        <p>"Hi "{user.userName}</p>
                    </>
                ) : (
                    <>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Header;