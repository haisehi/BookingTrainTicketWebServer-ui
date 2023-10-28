import { useState, useEffect } from "react";

import classNames from "classnames/bind";
import styles from "./Room.module.scss"

const cx = classNames.bind(styles)
const apiURL = process.env.REACT_APP_API_URL

function Room() {

    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ roomNumber: '', countChair: '', kind: '', train: '',nameTrain:'' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [trainList, setTrainList] = useState([]); // State để lưu danh sách tàu

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    //thêm
    const handleAdd = (e) => {
        e.preventDefault();
        // Gửi yêu cầu POST đến máy chủ
        fetch(`${apiURL}/v1/room`, {
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
                setFormData({ roomNumber: '', countChair: '', kind: '', train: '',nameTrain:'' });
            })
            .catch((error) => console.error(error));
    };
    //xem toa tàu
    const handleView = (e) => {
        e.preventDefault(); // Ngăn chặn trình duyệt tải lại trang
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách tàu
        fetch(`${apiURL}/v1/room`)
            .then((response) => response.json())
            .then((rooms) => {
                // Cập nhật danh sách tàu trong trạng thái (state) của ứng dụng React
                setData(rooms);
            })
            .catch((error) => console.error(error));
    };
    //xem danh sách tàu
    useEffect(() => {
        handleViewTrain(); // Gọi hàm này khi component được tạo
    }, []);

    const handleViewTrain = (e) => {
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách tàu
        fetch(`${apiURL}/v1/train`)
            .then((response) => response.json())
            .then((trains) => {
                // Cập nhật danh sách tàu trong state
                setTrainList(trains);
            })
            .catch((error) => console.error(error));
    };
    //hàm này dùng để xem tên của tàu theo _id
    const findTrainById = (trainId) => {
        const train = trainList.find(train => train._id === trainId);
        return train ? train.train : "Unknown";
    }
    //xem chi tiết toa tàu
    const handleViewARoom = (roomID) => {
        // Gửi yêu cầu GET đến máy chủ để lấy thông tin toa cụ thể
        fetch(`${apiURL}/v1/room/${roomID}`)
            .then((response) => response.json())
            .then((rooms) => {
                // Hiển thị thông tin toa trong cửa sổ hoặc cửa sổ mới, hoặc bạn có thể thực hiện hiển thị theo ý của bạn.
                console.log(rooms); // Hiển thị dữ liệu toa trong console hoặc bạn có thể hiển thị nó trên giao diện người dùng.
                // Trích xuất thông tin từ mảng rooms
                const ticket = rooms.ticket.map((room) => {
                    return `Chair: ${room.id}, state: ${room.state}, price: ${room.price}`;
                });
                console.log(ticket);

                alert(`Room number: ${rooms.roomNumber},count Chair: ${rooms.countChair}, Kind: ${rooms.kind},train:${rooms.train},nameTrain:${rooms.nameTrain}, ticket: [${ticket.join(', ')} ]`);
            })
            .catch((error) => console.error(error));
    };

    //sửa
    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(data[index]);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        // Tạo một đối tượng chứa dữ liệu cập nhật
        const updatedData = { ...formData };
        // Lấy _id của tàu cần cập nhật
        const roomID = data[editingIndex]._id;
        // Gửi yêu cầu PUT đến máy chủ để cập nhật tàu
        fetch(`${apiURL}/v1/room/${roomID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((updatedTrain) => {
                // Cập nhật danh sách toa trên trang với toa vừa được cập nhật
                const updatedData = [...data];
                updatedData[editingIndex] = updatedTrain;
                setData(updatedData);
                setEditingIndex(null);
                setFormData({ roomNumber: '', countChair: '', kind: '', train: '',nameTrain:'' });
            })
            .catch((error) => console.error(error));
    };
    //xoá
    const handleDelete = (index) => {
        // Lấy _id của toa cần xóa từ data
        const roomID = data[index]._id;
        // Gửi yêu cầu DELETE đến máy chủ
        fetch(`${apiURL}/v1/room/${roomID}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Xóa tàu khỏi danh sách trong trạng thái (state) của ứng dụng React
                const updatedData = [...data];
                updatedData.splice(index, 1);
                setData(updatedData);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className={cx('train-container')}>
            <form className={cx('train-form')}>
                <div className={cx('title')}>Room</div>
                <div className={cx('train-container')}>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Room Number</label>
                        <input
                            type="number"
                            name="roomNumber"
                            placeholder="Room Number"
                            value={formData.roomNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Count Chair</label>
                        <input
                            type="number"
                            name="countChair"
                            placeholder="Count Chair"
                            value={formData.countChair}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>kind</label>
                        <input
                            type="checkbox"
                            name="kind"
                            value="seat" // Để giá trị này là kiểu chữ
                            checked={formData.kind === "seat"} // Kiểm tra trạng thái checked
                            onChange={handleInputChange}
                        />
                        <span>Seat</span>
                        <input
                            type="checkbox"
                            name="kind"
                            value="lie" // Để giá trị này là kiểu chữ
                            checked={formData.kind === "lie"} // Kiểm tra trạng thái checked
                            onChange={handleInputChange}
                        />
                        <span>Lie</span>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Train</label>
                        <select
                            name="nameTrain"
                            value={formData.nameTrain}
                            onChange={handleInputChange}
                        >
                            <option value="">Choice Train</option>
                            {trainList.map((items, index) => (
                                <option key={index} value={items.nameTrain}>
                                    {items.train}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Name Train</label>
                        <select
                            name="train"
                            value={formData.train}
                            onChange={handleInputChange}
                        >
                            <option value="">Choice Train</option>
                            {trainList.map((items, index) => (
                                <option key={index} value={items._id}>
                                    {items.train}
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
                        <th>Room number</th>
                        <th>Count Chair</th>
                        <th>Kind</th>
                        <th>Train</th>
                        <th>Train Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.roomNumber}</td>
                            <td>{item.countChair}</td>
                            <td>{item.kind}</td>
                            <td>{findTrainById(item.train)}</td>
                            <td>{item.nameTrain}</td>
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

export default Room;