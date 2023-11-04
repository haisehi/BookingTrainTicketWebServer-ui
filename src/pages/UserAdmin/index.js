import className from "classnames/bind"
import styles from "./UserAdmin.module.scss"
import { deleteUser, getAllusers } from "../../redux/apiRequest"
import { createAxios } from "../../createInstance"

import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from "../../redux/authSlice"


const cx = className.bind(styles)

function UserAdmin() {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const userList = useSelector((state) => state.users.users?.allUsers)
    const mgs = useSelector((state) => state.users?.mgs)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let axiosJWT = createAxios(user,dispatch,loginSuccess)

    //delete
    const handleDelete = (id) => {
        console.log(id)
        deleteUser(user?.accessToken, dispatch, id ,axiosJWT)
    }    

    //kiểm tra user đã đăng nhập hay chưa , nếu chưa đăng nhập thì chuyển sang trang login
    useEffect(() => {
        if (!user) {
            navigate("/")
        }
        if (user?.accessToken) {
            getAllusers(user?.accessToken, dispatch , axiosJWT) //thêm axiosJWT để check xem user đã hết hạn hay chưa
        }
    }, [])

    return (
        <div>
            <div>{`Your role : ${user?.admin ? `Admin` : `User`}`}</div>
            <div>{mgs}</div>
            <table>
                <thead>

                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userList?.map((user, index) => (
                            <tr key={index}>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td><button className={cx('train-btn4')} onClick={() => handleDelete(user._id)}>Delete</button></td>
                            </tr>

                        ))
                    }

                </tbody>

            </table>
        </div>
    );
}

export default UserAdmin;