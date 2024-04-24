import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Spin, Card, Button, Row, Col } from "antd";

const Users = ({ match }) => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/auth/users");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCardClick = (user) => {
    setSelectedUser(selectedUser === user ? null : user); // Toggle selectedUser state
  };

  const handleCancel = () => {
    setSelectedUser(null); // Reset selectedUser when cancel button is clicked
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center m-4">All Users</h1>
            <Row gutter={[16, 16]}>
              {users.map((user, index) => (
                <Col key={user._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={`User ${index + 1}`}
                    onClick={() => handleCardClick(user)}
                    style={{ cursor: "pointer" }}
                  >
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {selectedUser === user && (
                      <div>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Answer:</strong> {user.answer}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <Button type="primary" onClick={handleCancel} style={{ marginTop: "10px" }}>
                          close
                        </Button>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="d-flex justify-content-center align-items-center">
              {loading && <Spin className="text-center" size="large" />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
