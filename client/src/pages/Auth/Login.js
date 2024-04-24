import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
// import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Toggle show/hide password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  return (
    <Layout title="Login - Ecommerce App">
      <div className="container log-container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-8 col-lg-6 col-12">
            <div className="card login-card">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Login Form</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Email"
                      required
                      autoComplete
                    />
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <EyeFill /> : <EyeSlashFill />}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3 text-center">
                    <button type="submit" className="btn btn-primary w-100">
                      Login
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => {
                        navigate("/forgot-password");
                      }}
                    >
                      Forgot Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
