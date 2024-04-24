import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Badge, Spin } from "antd";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(true); // Added loading state

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      // Reverse the order array to display latest order first
      setOrders(data.reverse());
      setLoading(false); 
    } catch (error) {
      console.log(error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (auth?.token) {
      setLoading(true); // Set loading to true before fetching orders
      getOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid p-3 dashboard mt-4">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h2 className="text-center m-4">Orders Details</h2>
            {loading ? ( // Render loading spinner if loading is true
              <div className="text-center">
                <Spin size="large" />
              </div>
            ) : orders.length === 0 ? ( // Handle case when no orders are found
              <div className="text-center">
                <h5> Orders not found.</h5>
              </div>
            ) : (
              orders?.map((o, i) => {
                return (
                  <div className="border shadow mb-4" key={i}>
                    {i === 0 && (
                      <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-info">
                        <span>Latest Order</span>
                      </div>
                    )}
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Buyer</th>
                            <th scope="col">Date</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{i + 1}</td>
                            <td>
                              {o?.status === "Not Process" && <Badge status="default" text="Not Process" />}
                              {o?.status === "Processing" && <Badge status="processing" text="Processing" />}
                              {o?.status === "Shipped" && <Badge status="processing" text="Shipped" />}
                              {o?.status === "delivered" && <Badge status="success" text="Delivered" />}
                              {o?.status === "cancel" && <Badge status="error" text="Cancelled" />}
                            </td>
                            <td>{o?.buyer?.name}</td>
                            <td>{moment(o?.createdAt).format("MMMM Do YYYY, h:mm a")}</td>
                            <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                            <td>{o?.products?.length}</td> 
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="container">
                      {o?.products?.map((p, index) => (
                        <div className="row mb-2 p-3 card flex-row" key={p._id}>
                          <div className="col-md-4">
                            <img
                              src={`/api/v1/product/product-photo/${p._id}`}
                              className="card-img-top"
                              alt={p.name}
                              width="100px"
                              height="100px"
                            />
                          </div>
                          <div className="col-md-8">
                            <p>{p.name}</p>
                            {p.description && <p>{p.description.substring(0, 50)}</p>}
                            <p>Rs {p.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
