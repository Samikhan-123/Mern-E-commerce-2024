import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-fluid my-4">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title mb-4">Welcome, {auth?.user?.name}</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Email:</strong> {auth?.user?.email}
                    </div>
                    <div className="mb-3">
                      <strong>Address:</strong> {auth?.user?.address || "N/A"}
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
