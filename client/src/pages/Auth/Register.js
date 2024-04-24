import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error || "Something went wrong");;
    }
  };

  return (
    <Layout title="Register - Ecommerce App">
      <div className="container reg-container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-8 col-lg-6 col-12">
            <div className="card login-card">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Register Form</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Name"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Email"
                      required
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
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeFill /> : <EyeSlashFill />}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Phone"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Address"
                      required
                    />
                  </div>

                    <div className="alert alert-success" role="alert">
                      <h4 className="alert-heading">Please Note it!</h4>
                      <p>Your orders shipping will be based on your full address, you can change address through dashboard </p>
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="form-control"
                        placeholder="What is Your Favorite Sports"
                        required
                      />
                    </div>
                    <div className="mb-3 text-center">
                      <button type="submit" className="btn btn-primary w-100">
                        REGISTER
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

export default Register;
