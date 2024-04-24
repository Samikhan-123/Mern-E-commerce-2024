import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import useCategory from "../../hooks/useCategory";
import Dropdown from 'react-bootstrap/Dropdown';
import { useCart } from "../../context/cart";
import { Badge } from 'antd';


const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const categories = useCategory()
  const navigate = useNavigate()
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
      localStorage.removeItem("auth");
      navigate('/')
      toast.success("Logout Successfully");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            🛒 E-commerce App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle className="btn btn-dark text-light pt-2 fw-100" id="dropdown-basic">
                    Categories
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item to={'/category'} as={NavLink}>
                      All Categories
                    </Dropdown.Item>
                    <hr />
                    {categories?.map((c) => (
                      <>
                        <Dropdown.Item key={c._id} to={`/category/${c.slug}`} as={NavLink}>
                          {c.name}
                        </Dropdown.Item>
                      </>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

              </li>
              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Dropdown>
                      <Dropdown.Toggle className="btn btn-dark text-light pt-2 fw-100" id="dropdown-basic">
                        {auth?.user?.name}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <NavLink
                          to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                          className="dropdown-item"
                        >
                          Dashboard
                          </NavLink>
                          {/* <hr />
                          <NavLink
                            to={`/dashboard/${auth?.user?.role === 1 ? "admin/orders" : "user/orders"}`}
                            className="dropdown-item"
                          >
                            Orders
                          </NavLink>
                          <NavLink
                            to={`/dashboard/${auth?.user?.role === 1 ? "admin/profile" : "user/profile"}`}
                            className="dropdown-item"
                          >
                            Profile
                          </NavLink> */}
                        <button onClick={handleLogout} className="dropdown-item">
                          Logout
                        </button>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>

                  {/* <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"
                            }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li> */}


                </>
              )}
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link fw-bold pt-2">
                  Cart
                </NavLink>
                <Badge className="position-relative p-0 mt--3 top-0 end-0" count={cart.length}>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
