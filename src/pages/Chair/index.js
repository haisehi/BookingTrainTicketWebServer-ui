import { useState, useEffect } from "react";

import classNames from "classnames/bind";
import styles from "./Chair.module.scss"

const cx = classNames.bind(styles)
const apiURL = process.env.REACT_APP_API_URL

function Chair() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ numberChair: '', kind: '', state: false, rooms: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [RoomList, setRoomList] = useState([]); // State để lưu danh sách ghế

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Kiểm tra nếu checkbox được chọn
            // const newValue = e.target.checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            // Xử lý các trường khác như trước
            setFormData({ ...formData, [name]: value });
        }
    };

    //thêm xong
    const handleAdd = (e) => {
        e.preventDefault();

        // Chuyển giá trị state từ chuỗi thành boolean
        const newState = formData.state === 'true';
        // Cập nhật state cho formData
        setFormData({ ...formData, state: newState });
        // Gửi yêu cầu POST đến máy chủ
        fetch(`${apiURL}/v1/chair`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((newRoom) => {
                // Cập nhật danh sách tàu hỏa sau khi thêm thành công
                setData([...data, newRoom]);
                setFormData({ numberChair: '', kind: '', state: false, rooms: '' });
            })
            .catch((error) => console.error(error));
    };

    //xem ghế xong
    const handleView = (e) => {
        e.preventDefault(); // Ngăn chặn trình duyệt tải lại trang
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách ghế
        fetch(`${apiURL}/v1/chair`)
            .then((response) => response.json())
            .then((chair) => {
                console.log(chair)
                // Cập nhật danh sách ghế trong trạng thái (state) của ứng dụng React
                setData(chair);
            })
            .catch((error) => console.error(error));
    };
    //xem danh sách toa
    useEffect(() => {
        handleViewRoom(); // Gọi hàm này khi component được tạo
    }, []);

    const handleViewRoom = (e) => {
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách toa
        fetch(`${apiURL}/v1/room`)
            .then((response) => response.json())
            .then((rooms) => {
                // Cập nhật danh sách ghế trong state
                setRoomList(rooms);
            })
            .catch((error) => console.error(error));
    };
    //hàm này dùng để xem tên của toa theo _id
    const findRoomID = (rooms) => {
        const room = RoomList.find(room => room._id === rooms);
        return room ? room.roomNumber : "Unknown";
    }
    //xem chi tiết ghế ghế
    const handleViewARoom = (chair) => {
        // Gửi yêu cầu GET đến máy chủ để lấy thông tin ghế cụ thể
        fetch(`${apiURL}/v1/chair/${chair}`)
            .then((response) => response.json())
            .then((chairs) => {
                // Hiển thị thông tin ghế trong cửa sổ hoặc cửa sổ mới, hoặc bạn có thể thực hiện hiển thị theo ý của bạn.
                console.log(chairs); // Hiển thị dữ liệu ghế trong console hoặc bạn có thể hiển thị nó trên giao diện người dùng.
                // Trích xuất thông tin từ mảng chairs
                const rooms = chairs.rooms.map((chair) => {
                    return `Room: ${chair.roomNumber}, count chair: ${chair.countChair}, kind: ${chair.kind}`;
                });

                alert(`chair number: ${chairs.numberChair},count Chair: ${chairs.kind}, Kind: ${chairs.state}, rooms: [${rooms.join(', ')} ]`);
            })
            .catch((error) => console.error(error));
    };

    //sửa xong
    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(data[index]);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        // Tạo một đối tượng chứa dữ liệu cập nhật
        const updatedData = { ...formData };
        // Lấy _id của ghế cần cập nhật
        const chairID = data[editingIndex]._id;
        // Gửi yêu cầu PUT đến máy chủ để cập nhật ghế
        fetch(`${apiURL}/v1/chair/${chairID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((updatechairs) => {
                // Cập nhật danh sách ghế trên trang với ghế vừa được cập nhật
                const updatedData = [...data];
                updatedData[editingIndex] = updatechairs;
                setData(updatedData);
                setEditingIndex(null);
                setFormData({ numberChair: '', kind: '', state: '', rooms: '', ticket: '' });
            })
            .catch((error) => console.error(error));
    };
    //xoá xong
    const handleDelete = (index) => {
        // Lấy _id của ghế cần xóa từ data
        const roomID = data[index]._id;
        // Gửi yêu cầu DELETE đến máy chủ
        fetch(`${apiURL}/v1/chair/${roomID}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Xóa ghế khỏi danh sách trong trạng thái (state) của ứng dụng React
                const updatedData = [...data];
                updatedData.splice(index, 1);
                setData(updatedData);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className={cx('train-container')}>
            <form className={cx('train-form')}>
                <div className={cx('title')}>Chair</div>
                <div className={cx('train-container')}>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Chair's Number</label>
                        <input
                            type="text"
                            name="numberChair"
                            placeholder="Chair Number"
                            value={formData.numberChair}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>State</label>
                        <input
                            type="checkbox"
                            name="state"
                            value="false"
                            checked={formData.state === false}
                            onChange={handleInputChange}
                        />
                        <span>False</span>
                        <input
                            type="checkbox"
                            name="state"
                            value="true"
                            checked={formData.state === true}
                            onChange={handleInputChange}
                        />
                        <span>True</span>

                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>kind</label>
                        <input
                            type="radio"
                            name="kind"
                            value="VIP"
                            checked={formData.kind === "VIP"}
                            onChange={handleInputChange}
                        />
                        <span>VIP</span>
                        <input
                            type="radio"
                            name="kind"
                            value="Normal"
                            checked={formData.kind === "Normal"}
                            onChange={handleInputChange}
                        />
                        <span>Normal</span>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Room</label>
                        <select
                            name="rooms"
                            value={formData.rooms}
                            onChange={handleInputChange}
                        >
                            <option value="">Choice rooms</option>
                            {RoomList.map((items, index) => (
                                <option key={index} value={items._id}>
                                    {items.roomNumber}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>

                <div className={cx('train-btn')}>
                    {editingIndex !== null ? (
                        <button className={cx('train-btn2')} onClick={handleUpdate}>Update</button>
                    ) : (
                        <button className={cx('train-btn1')} onClick={handleAdd}>Add</button>
                    )}
                </div>
                <div className={cx('train-btn')}>
                    <button className={cx('train-btn3')} onClick={handleView}>view</button>
                </div>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Chair number</th>
                        <th>kind</th>
                        <th>State</th>
                        <th>Room</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.numberChair}</td>
                            <td>{item.kind}</td>
                            <td>{item.state ? "True" : "False"}</td>
                            <td>{findRoomID(item.rooms)}</td>
                            <td>
                                <button className={cx('train-btn2')} onClick={() => handleEdit(index)}>Edit</button>
                                <button className={cx('train-btn3')} onClick={() => handleViewARoom(item._id)}>View</button>
                                <button className={cx('train-btn4')} onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Chair;