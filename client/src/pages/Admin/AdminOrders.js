import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Badge, Select, Spin, Tag } from "antd";
const { Option } = Select;

const AdminOrders = () => {
    const [status, setStatus] = useState([
        "Not Process",
        "Processing",
        "Shipped",
        "delivered",
        "cancel",
    ]);
    const [orders, setOrders] = useState();
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(false);

    const getOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/v1/auth/all-orders");
            // Reverse the order of data to show latest order first
            setOrders(data.reverse());
            console.log(data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            // setLoading(true);
            const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
                status: value,
            });
            // Update the status in the orders state
            const updatedOrders = orders.map((order) =>
                order._id === orderId ? { ...order, status: value } : order
            );
            setOrders(updatedOrders);
        } catch (error) {
            console.log(error);
            toast.error("Error updating order status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title={"All Orders Data"}>
            <div className="container-fluid p-3 dashboard mt-2">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center m-4">Admin - All Orders Details</h1>
                        {loading ? (
                            <div className="text-center">
                                <Spin size="large" />
                            </div>
                        ) : (
                            orders?.map((o, i) => (
                                <div className="border shadow mb-4" key={i}>
                                    {i === 0 && (
                                        <Tag color="blue">Latest Order</Tag> // Add tag for new order
                                    )}
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Buyer</th>
                                                    <th scope="col">Contact</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Payment</th>
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        {o?.status === "Not Process" && (
                                                            <Badge status="default" />
                                                        )}
                                                        {o?.status === "Processing" && (
                                                            <Badge status="processing" />
                                                        )}
                                                        {o?.status === "Shipped" && (
                                                            <Badge status="processing" />
                                                        )}
                                                        {o?.status === "delivered" && (
                                                            <Badge status="success" />
                                                        )}
                                                        {o?.status === "cancel" && (
                                                            <Badge status="error" />
                                                        )}
                                                        <Select
                                                            bordered={false}
                                                            onChange={(value) => handleChange(o._id, value)}
                                                            defaultValue={o?.status}
                                                        >
                                                            {status.map((s, i) => (
                                                                <Option key={i} value={s}>
                                                                    {s}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </td>
                                                    <td>{o?.buyer?.name}</td>
                                                    <td>{o?.buyer?.phone}</td>
                                                    <td>{moment(o?.createdAt).format("MMMM Do YYYY, h:mm a")}</td>
                                                    <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                    <td>{o?.products?.length}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="container">
                                        {o?.products?.map((p, i) => (
                                            <div className="row mb-2 p-3 card flex-row" key={p._id}>
                                                <div className="col-12 col-md-4 mb-3 mb-md-0">
                                                    <img
                                                        src={`/api/v1/product/product-photo/${p._id}`}
                                                        className="card-img-top"
                                                        alt={p.name}
                                                        style={{ maxHeight: "100px", objectFit: "cover" }}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-8">
                                                    <p>{p.name}</p>
                                                    {p?.description && <p>{p.description.substring(0, 50)}</p>}
                                                    <p>Rs {p.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminOrders;
