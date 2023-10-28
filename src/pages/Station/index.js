import { useState } from "react";

import classNames from "classnames/bind";
import styles from "./Chair.module.scss"

const cx = classNames.bind(styles)
const apiURL = process.env.REACT_APP_API_URL

function Station() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ NameStation: '', address: '' });
    const [editingIndex, setEditingIndex] = useState(null);

    //pages
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Số lượng mục trên mỗi trang
    // Hàm để lọc dữ liệu dựa trên trang hiện tại
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = data.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    //REST API
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    //xong
    const handleAdd = (e) => {
        e.preventDefault();
        // Gửi yêu cầu POST đến máy chủ
        fetch(`${apiURL}/v1/station`, {
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
                setFormData({ NameStation: '', address: '' });
            })
            .catch((error) => console.error(error));
    };
    //xong
    const handleView = (e) => {
        e.preventDefault(); // Ngăn chặn trình duyệt tải lại trang
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách tàu
        fetch(`${apiURL}/v1/station`)
            .then((response) => response.json())
            .then((trains) => {
                // Cập nhật danh sách tàu trong trạng thái (state) của ứng dụng React
                setData(trains);
            })
            .catch((error) => console.error(error));
    };

    const handleViewAStation = (trainId) => {
        // Gửi yêu cầu GET đến máy chủ để lấy thông tin tàu cụ thể
        fetch(`${apiURL}/v1/station/${trainId}`)
            .then((response) => response.json())
            .then((stations) => {
                // Hiển thị thông tin tàu trong cửa sổ hoặc cửa sổ mới, hoặc bạn có thể thực hiện hiển thị theo ý của bạn.
                console.log(stations); // Hiển thị dữ liệu tàu trong console hoặc bạn có thể hiển thị nó trên giao diện người dùng.
                // Trích xuất thông tin từ mảng rooms
                // const roomsInfo = stations.ticket.map((station) => {
                //     return `station from: ${station.}, station to: ${station.kind}`;
                // });

                alert(`Train: ${stations.from}, Count Room: ${stations.to}`);
            })
            .catch((error) => console.error(error));
    };

    //xong
    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(data[index]);
    };
    //xong
    const handleUpdate = (e) => {
        e.preventDefault();

        // Tạo một đối tượng chứa dữ liệu cập nhật
        const updatedData = { ...formData };

        // Lấy _id của tàu cần cập nhật
        const trainId = data[editingIndex]._id;

        // Gửi yêu cầu PUT đến máy chủ để cập nhật tàu
        fetch(`${apiURL}/v1/station/${trainId}`, {
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
                setFormData({ NameStation: '', address: '' });
            })
            .catch((error) => console.error(error));
    };
    //xong
    const handleDelete = (index) => {
        // Lấy _id của tàu cần xóa từ data
        const trainIdToDelete = data[index]._id;
        // Gửi yêu cầu DELETE đến máy chủ
        fetch(`${apiURL}/v1/station/${trainIdToDelete}`, {
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
                <div className={cx('title')}>Station</div>
                <div className={cx('train-container')}>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Name Station</label>
                        <input
                            type="text"
                            name="NameStation"
                            placeholder="NameStation"
                            value={formData.NameStation}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="address"
                            value={formData.address}
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
                        <th>Name Station</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.NameStation}</td>
                            <td>{item.address}</td>
                            <td>
                                <button className={cx('train-btn2')} onClick={() => handleEdit(index)}>Edit</button>
                                <button className={cx('train-btn3')} onClick={() => handleViewAStation(item._id)}>View</button>
                                <button className={cx('train-btn4')} onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={cx('button')}>
                <button className={cx('button_left')} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span className={cx('button_pageNumber')}>Page {currentPage} of {totalPages}</span>
                <button className={cx('button_right')} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Station;