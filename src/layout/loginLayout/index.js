import classNames from "classnames/bind";

import Header from '../header'
import styles from "./LoginLayout.module.scss"

const cx = classNames.bind(styles)
function LoginLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx("container")}>
                <div className={cx("content")}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default LoginLayout;