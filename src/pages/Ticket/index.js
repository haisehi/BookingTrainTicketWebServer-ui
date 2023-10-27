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
            rooms: ''
        });
    const [editingIndex, setEditingIndex] = useState(null);
    const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa
    const [stationList, setstationList] = useState([]);  // State để lưu danh sách toa


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

    const handleAdd = (e) => {
        e.preventDefault();

        // Gửi yêu cầu POST đến máy chủ
        fetch(`${apiURL}/v1/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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
                    rooms: ''
                });
                console.log(newTicket)
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

                alert(`from: ${ticket.form}, to: ${ticket.to}, chair number: ${ticket.rooms.roomNumber}`);
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
                    rooms: ''
                });
            })
            .catch((error) => console.error(error));
    };
    //xong
    const handleDelete = (index) => {
        // Lấy _id của tàu cần xóa từ data
        const ticketIDToDelete = data[index]._id;
        // Gửi yêu cầu DELETE đến máy chủ
        fetch(`${apiURL}/v1/tickets/${ticketIDToDelete}`, {
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
                <div className={cx('title')}>Ticket</div>
                <div className={cx('train-container')}>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>From</label>
                        <select
                            name="from"
                            value={formData.from}
                            onChange={handleInputChange}
                        >
                            <option value="">Choice station</option>
                            {stationList.map((items, index) => (
                                <option key={index} value={items.NameStation}>
                                    {items.NameStation}
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
                        >
                            <option value="">Choice station</option>
                            {stationList.map((items, index) => (
                                <option key={index} value={items.NameStation}>
                                    {items.NameStation}
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

                        <select
                            name="timeGoreturn"
                            value={formData.timeGoreturn}
                            onChange={handleInputChange}
                        >
                            <option>Choice time</option>
                            <option value="All Times">All time</option>
                            <option value="0h to 6h">0h to 6h</option>
                            <option value="6h to 12h">6h to 12h</option>
                            <option value="12h to 18h">12h to 18h</option>
                            <option value="18h to 0h">18h to 0h</option>

                        </select>
                    </div>
                    <div className={cx('train-input')}>
                        <label className={cx('train-label')}>Time To Return</label>

                        <select
                            name="timeToreturn"
                            value={formData.timeToreturn}
                            onChange={handleInputChange}
                        >
                            <option>Choice time</option>
                            <option value="All Times">All time</option>
                            <option value="0h to 6h">0h to 6h</option>
                            <option value="6h to 12h">6h to 12h</option>
                            <option value="12h to 18h">12h to 18h</option>
                            <option value="18h to 0h">18h to 0h</option>

                        </select>
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
                    {data.map((item, index) => (
                        <tr key={index}>
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
                                <button className={cx('train-btn2')} onClick={() => handleEdit(index)}>Edit</button>
                                <button className={cx('train-btn3')} onClick={() => handleViewATicket(item._id)}>View</button>
                                <button className={cx('train-btn4')} onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Ticket;