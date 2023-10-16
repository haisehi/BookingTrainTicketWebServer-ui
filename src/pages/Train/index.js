import { useState } from "react";

import className from "classnames/bind"
import styles from "./train.module.scss"

const cx = className.bind(styles)
//duong dan URL api
const apiURL = process.env.REACT_APP_API_URL

function Train() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ train: '', countRoom: '' });
    const [editingIndex, setEditingIndex] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        // Gửi yêu cầu POST đến máy chủ
        fetch(`${apiURL}/v1/train`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((newTrain) => {
                // Cập nhật danh sách tàu hỏa sau khi thêm thành công
                setData([...data, newTrain]);
                setFormData({ train: '', countRoom: '' });
            })
            .catch((error) => console.error(error));
    };

    const handleView = (e) => {
        e.preventDefault(); // Ngăn chặn trình duyệt tải lại trang
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách tàu
        fetch(`${apiURL}/v1/train`)
            .then((response) => response.json())
            .then((trains) => {
                // Cập nhật danh sách tàu trong trạng thái (state) của ứng dụng React
                setData(trains);
            })
            .catch((error) => console.error(error));
    };


    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(data[index]);
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        // Tạo một đối tượng chứa dữ liệu cập nhật
        const updatedData = { ...formData };

        // Lấy _id của tàu cần cập nhật
        const trainId = data[editingIndex]._id;

        // Gửi yêu cầu PUT đến máy chủ để cập nhật tàu
        fetch(`${apiURL}/v1/train/${trainId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((updatedTrain) => {
                // Cập nhật danh sách tàu trên trang với tàu vừa được cập nhật
                const updatedData = [...data];
                updatedData[editingIndex] = updatedTrain;
                setData(updatedData);
                setEditingIndex(null);
                setFormData({ train: '', countRoom: '' });
            })
            .catch((error) => console.error(error));
    };

    const handleDelete = (index) => {
        // Lấy _id của tàu cần xóa từ data
        const trainIdToDelete = data[index]._id;
        // Gửi yêu cầu DELETE đến máy chủ
        fetch(`${apiURL}/v1/train/${trainIdToDelete}`, {
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
                <div className={cx('title')}>Train</div>
                <div className={cx('train-container')}>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Train</label>
                        <input
                            type="text"
                            name="train"
                            placeholder="Train"
                            value={formData.train}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Count Room</label>
                        <input
                            type="number"
                            name="countRoom"
                            placeholder="CoutRoom"
                            value={formData.countRoom}
                            onChange={handleInputChange}
                        />
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
                        <th>Train</th>
                        <th>coutRoom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.train}</td>
                            <td>{item.countRoom}</td>
                            <td>
                                <button className={cx('train-btn2')} onClick={() => handleEdit(index)}>Edit</button>
                                <button className={cx('train-btn3')} >view</button>
                                <button className={cx('train-btn4')} onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Train;