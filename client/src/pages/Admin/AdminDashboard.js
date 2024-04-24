import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container-fluid py-3">
        <div className="row">
          {/* Admin Menu */}
          <div className="col-md-3">
            <AdminMenu />
          </div>
          {/* Admin Info */}
          <div className="col-md-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-4">Admin Details</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Name:</span>
                    <span>{auth?.user?.name}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Email:</span>
                    <span>{auth?.user?.email}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Contact:</span>
                    <span>{auth?.user?.phone}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
