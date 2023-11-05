import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Ticket.module.scss"

const cx = classNames.bind(styles)
const apiURL = process.env.REACT_APP_API_URL


function Ticket() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState(
        {
            from: '',
            to: '',
            departure: '',
            return: '',
            timeGodeparture: '',
            timeTodeparture: '',
            timeGoreturn: '',
            timeToreturn: '',
            ticketType: '',
            price: '',
            numberChair: '',
            kind: '',
            state: false,
            rooms: '',
            img: '' // Thêm trường để lưu đường dẫn của ảnh
        });
    // Thêm state mới để lưu đường dẫn ảnh
    const [imageURL, setImageURL] = useState(''); // State để lưu đường dẫn ảnh
    const [editingIndex, setEditingIndex] = useState(null);
    const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa
    const [stationList, setstationList] = useState([]);  // State để lưu danh sách toa
    //pages
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Số lượng mục trên mỗi trang
    // Tính tổng số trang 
    const totalPages = Math.ceil(data.length / itemsPerPage);
    //Tính chỉ số bắt đầu của dữ liệu trên trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    //Tính chỉ số kết thúc của dữ liệu trên trang hiện tại
    const endIndex = startIndex + itemsPerPage;
    //Tạo một mảng currentData chứa dữ liệu của trang hiện tại 
    const currentData = data.slice(startIndex, endIndex);
    //cập nhật trang hiện tại khi người dùng chọn trang khác
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    //REST API
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Kiểm tra nếu checkbox được chọn
            // const newValue = e.target.checked;
            setFormData({ ...formData, [name]: checked });
        }
        else if (type === 'file') {
            // Xử lý trường input loại file
            // Lấy tệp từ e.target.files[0]
            setFormData({ ...formData, [name]: e.target.files[0] });
        }
        else {
            // Xử lý các trường khác như trước
            setFormData({ ...formData, [name]: value });
        }
    };
    //xong
    const handleImageUpload = (e) => {
        const formData = new FormData();
        formData.append('img', e.target.files[0]);
    
        fetch(`${apiURL}/v1/tickets/upload-image`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.imageUrl) {
                    // Set the img field in the formData
                    setFormData({
                        ...formData,
                        img: data.imageUrl
                    });
                    console.log(data.imageUrl);
                }
            })
            .catch((error) => console.error(error));
    };
    //xong
    const handleAdd = (e) => {
        e.preventDefault();
    
        // Gửi yêu cầu POST đến máy chủ
        fetch(`${apiURL}/v1/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData }),
        })
            .then((response) => response.json())
            .then((newTicket) => {
                // Cập nhật danh sách tàu hỏa sau khi thêm thành công
                setData([...data, newTicket]);
                // Đặt lại giá trị formData
                setFormData({
                    from: '',
                    to: '',
                    departure: '',
                    return: '',
                    timeGodeparture: '',
                    timeTodeparture: '',
                    timeGoreturn: '',
                    timeToreturn: '',
                    ticketType: '',
                    price: '',
                    numberChair: '',
                    kind: '',
                    state: false,
                    rooms: '',
                    img: '', // Reset the img field
                });
                console.log(newTicket);
            })
            .catch((error) => console.error(error));
    };

    //xong
    const handleView = (e) => {
        e.preventDefault(); // Ngăn chặn trình duyệt tải lại trang
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách tàu
        fetch(`${apiURL}/v1/tickets`)
            .then((response) => response.json())
            .then((trains) => {
                // Cập nhật danh sách tàu trong trạng thái (state) của ứng dụng React
                setData(trains);
            })
            .catch((error) => console.error(error));
    };
    //xong
    const handleViewATicket = (ticket) => {
        // Gửi yêu cầu GET đến máy chủ để lấy thông tin tàu cụ thể
        fetch(`${apiURL}/v1/tickets/${ticket}`)
            .then((response) => response.json())
            .then((ticket) => {
                // Hiển thị thông tin tàu trong cửa sổ hoặc cửa sổ mới, hoặc bạn có thể thực hiện hiển thị theo ý của bạn.
                console.log(ticket); // Hiển thị dữ liệu tàu trong console hoặc bạn có thể hiển thị nó trên giao diện người dùng.
                // Trích xuất thông tin từ mảng rooms

                alert(`from: ${ticket.from}, to: ${ticket.to}, chair number: ${ticket.rooms.nameTrain}`);
            })
            .catch((error) => console.error(error));
    };
    //----------------------------------------------------------------
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

    //----------------------------------------------------------------
    //xem danh sách trạm
    useEffect(() => {
        handleViewStation(); // Gọi hàm này khi component được tạo
    }, []);

    const handleViewStation = (e) => {
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách toa
        fetch(`${apiURL}/v1/station`)
            .then((response) => response.json())
            .then((stations) => {
                // Cập nhật danh sách ghế trong state
                setstationList(stations);
            })
            .catch((error) => console.error(error));
    };
    //hàm này dùng để xem tên của toa theo _id
    const findStationID = (stations) => {
        const station = stationList.find(station => station._id === stations);
        return station ? station.NameStation : "Unknown";
    }
    //----------------------------------------------------------------
    //xong
    const handleEdit = (trainId) => {
        const index = data.findIndex((item) => item._id === trainId);
        setEditingIndex(index);
        setFormData(data[index]);
    };
    //xong
    const handleUpdate = (e) => {
        e.preventDefault();

        // Tạo một đối tượng chứa dữ liệu cập nhật
        const updatedData = { ...formData };

        // Lấy _id của tàu cần cập nhật
        const ticketID = data[editingIndex]._id;

        // Gửi yêu cầu PUT đến máy chủ để cập nhật tàu
        fetch(`${apiURL}/v1/tickets/${ticketID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((updatedTicket) => {
                // Cập nhật danh sách tàu trên trang với tàu vừa được cập nhật
                const updatedData = [...data];
                updatedData[editingIndex] = updatedTicket;
                setData(updatedData);
                setEditingIndex(null);
                setFormData({
                    from: '',
                    to: '',
                    departure: '',
                    return: '',
                    timeGodeparture: '',
                    timeTodeparture: '',
                    timeGoreturn: '',
                    timeToreturn: '',
                    ticketType: '',
                    price: '',
                    numberChair: '',
                    kind: '',
                    state: false,
                    rooms: '',
                    img: ''
                });
            })
            .catch((error) => console.error(error));
    };
    //xong
    const handleDelete = (ticketsID) => {
        // Tìm chỉ mốc index dựa trên _id
        const index = data.findIndex((item) => item._id === ticketsID);

        // Kiểm tra nếu index hợp lệ
        if (index !== -1) {
            // Gửi yêu cầu DELETE đến máy chủ để xóa tàu
            fetch(`${apiURL}/v1/tickets/${ticketsID}`, {
                method: 'DELETE',
            })
                .then(() => {
                    // Xóa tàu khỏi danh sách trong trạng thái (state) của ứng dụng React
                    const updatedData = [...data];
                    updatedData.splice(index, 1);
                    setData(updatedData);
                })
                .catch((error) => console.error(error));
        }
    };
    // Thêm hàm để xử lý sự kiện tải lên ảnh
    // const handleImageUpload = (e) => {
    //     const formData = new FormData();
    //     formData.append('img', e.target.files[0]);

    //     fetch(`${apiURL}/v1/tickets/upload-image`, {
    //         method: 'POST',
    //         body: formData,
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.imageUrl) {
    //                 setImageURL(data.imageUrl);
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // };


    return (
        <div className={cx('train-container')}>
            <form className={cx('train-form')}>
                <div className={cx('title')}>Ticket</div>
                <div className={cx('train-container')}>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>From</label>
                        <select
                            name="from"
                            value={formData.from}
                            onChange={handleInputChange}
                            className={cx('custom-select')}
                        >
                            <option value="">Choice station</option>
                            {stationList.map((items, index) => (
                                <option key={index} value={items.NameStation}>
                                    {items.NameStation} - {items.address}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>To</label>
                        <select
                            name="to"
                            value={formData.to}
                            onChange={handleInputChange}
                            className={cx('custom-select')}
                        >
                            <option value="">Choice station</option>
                            {stationList.map((items, index) => (
                                <option key={index} value={items.NameStation}>
                                    {items.NameStation} - {items.address}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Departure</label>
                        <input
                            type="date"
                            name="departure"
                            placeholder="Departure"
                            value={formData.departure}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>return</label>
                        <input
                            type="date"
                            name="return"
                            placeholder="Return"
                            value={formData.return}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Time Go Departure</label>
                        <input
                            name="timeGodeparture"
                            value={formData.timeGodeparture}
                            onChange={handleInputChange}
                            type="time"
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Time To Departure</label>
                        <input
                            type="time"
                            name="timeTodeparture"
                            value={formData.timeTodeparture}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Time Go Return</label>
                        <input
                            type="time"
                            name="timeGoreturn"
                            value={formData.timeGoreturn}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Time To Return</label>
                        <input
                            type="time"
                            name="timeToreturn"
                            value={formData.timeToreturn}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Ticket Type</label>

                        <select
                            name="ticketType"
                            value={formData.ticketType}
                            onChange={handleInputChange}
                        >
                            <option>Choice type of ticket</option>
                            <option value="Oneway">One way</option>
                            <option value="Roundtrip">Roundtrip</option>
                        </select>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Price</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                    </div>
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
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Image</label>
                        <input
                            type="file"
                            name="img"
                            onChange={handleImageUpload}
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
                        <th>image</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Departure</th>
                        <th>Return</th>
                        <th>Time go departure</th>
                        <th>Time to departure</th>
                        <th>Time go return</th>
                        <th>Time to return</th>
                        <th>Ticket type</th>
                        <th>Price</th>
                        <th>Number Chair</th>
                        <th>State</th>
                        <th>Kind</th>
                        <th>Room</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.img && <img style={{ height: '50px' }} src={`${apiURL}/${item.img}`} alt="Uploaded" />}</td>
                            <td>{item.from}</td>
                            <td>{item.to}</td>
                            <td>{item.departure}</td>
                            <td>{item.return}</td>
                            <td>{item.timeGodeparture}</td>
                            <td>{item.timeTodeparture}</td>
                            <td>{item.timeGoreturn}</td>
                            <td>{item.timeToreturn}</td>
                            <td>{item.ticketType}</td>
                            <td>{item.price} VND</td>
                            <td>{item.numberChair}</td>
                            <td>{item.state ? "True" : "False"}</td>
                            <td>{item.kind}</td>
                            <td>{findRoomID(item.rooms)}</td>
                            <td>
                                <button className={cx('train-btn2')} onClick={() => handleEdit(item._id)}>Edit</button>
                                <button className={cx('train-btn3')} onClick={() => handleViewATicket(item._id)}>View</button>
                                <button className={cx('train-btn4')} onClick={() => handleDelete(item._id)}>Delete</button>
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

export default Ticket;