import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './customer.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL;

function Customer() {
    const [customer, setCustomer] = useState([]);
    const [RoomList, setRoomList] = useState([]);
    const [trainList, setTrainList] = useState([]);

    const handleViewRoom = () => {
        fetch(`${apiURL}/v1/tickets`)
            .then((response) => response.json())
            .then((rooms) => {
                setRoomList(rooms);
                setTrainList(rooms);
            })
            .catch((error) => console.error(error));
    };

    const findRoomID = (rooms) => {
        const room = RoomList.find((room) => room._id === rooms);
        return room ? room.roomNumber : 'Unknown';
    };

    const findTrainID = (trains) => {
        const room = RoomList.find((train) => train._id === trains);
        return room ? room.from : 'Unknown';
    };

    useEffect(() => {
        fetch(`${apiURL}/v1/customer`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((customerData) => {
                setCustomer(customerData);
            });

        handleViewRoom();
    }, []);

    return (
        <div className={cx('customer-container')}>
            <h1>Khách hàng</h1>
            <div className={cx('table-container')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Object</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>CMND</th>
                            <th>Address</th>
                            <th>Pay Method</th>
                            <th>Created At</th>
                            <th>Mã vé</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customer.map((customerItem) => (
                            <tr key={customerItem._id} className={cx('customer-card')}>
                                <td>{customerItem.name}</td>
                                <td>{customerItem.object}</td>
                                <td>{customerItem.phone}</td>
                                <td>{customerItem.email}</td>
                                <td>{customerItem.CMND}</td>
                                <td>{customerItem.address}</td>
                                <td>{customerItem.paymethod}</td>
                                <td>{customerItem.createdAt}</td>
                                <td>{customerItem.ticket}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
}

export default Customer;
