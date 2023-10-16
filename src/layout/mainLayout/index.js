import classNames from "classnames/bind";

import Header from '../header'
import SideBar from '../sideBar'
import styles from "./mainLayout.module.scss"

const cx = classNames.bind(styles)
function mainLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx("container")}>
                <div className={cx('sideBar')}>
                    <SideBar />
                </div>
                <div className={cx("content")}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default mainLayout;