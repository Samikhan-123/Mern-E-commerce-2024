import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Spin, Radio, message } from "antd";
import { priceFilter } from "./../components/PricesFilter";
import { useCart } from "../context/cart";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
const navigate = useNavigate()
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError('Something went wrong');
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllProducts();
  }, []);

  const handleCategoryFilter = (categoryId, checked) => {
    if (checked) {
      setCheckedCategories([...checkedCategories, categoryId]);
    } else {
      setCheckedCategories(checkedCategories.filter(id => id !== categoryId));
    }
  };

  const handlePriceFilter = (priceRange) => {
    setSelectedPriceRange(priceRange);
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      if (checkedCategories.length > 0) {
        filtered = filtered.filter((product) => {
          const productCategoryId = product.category._id;
          return checkedCategories.includes(productCategoryId);
        });
      }

      if (selectedPriceRange) {
        filtered = filtered.filter(
          (product) =>
            product.price >= selectedPriceRange[0] &&
            product.price <= selectedPriceRange[1]
        );
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [products, checkedCategories, selectedPriceRange]);

  const showMessage = (text) => {
    setMessageText(text);
    toast.info(text); // Show message using antd message component
  };

  const handleFilter = () => {
    setCheckedCategories([]);
    setSelectedPriceRange(null);
    window.location.reload();
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-12 col-xs-12 col-sm-12  p-0">
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block" width='1400' height='600' alt="First slide" />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Title of First Slide</h5>
                    <p>Description of First Slide</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block" width='1400' height='600' alt="Second slide" />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Title of Second Slide</h5>
                    <p>Description of Second Slide</p>
                  </div>
                </div>
                <div className="carousel-item"> 
                  <img src="https://images.unsplash.com/photo-1682364853446-db043f643207?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block" width='1400' height='600' alt="Third slide" />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Title of Third Slide</h5>
                    <p>Description of Third Slide</p>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        <h1 style={{ marginTop: '170px', marginBottom: '50px' }} className="text-center">All Products</h1>
        <div className="row">
          <details>
            <summary className="btn  btn-outline-info btn-sm fw-bold mb-4"> Filters </summary>
            <div className="col-md-12 d-flex justify-content-around p-2 shadow">
              <div className="d-block">
                <h4 className="">Filter Category</h4>
                {categories?.map((c) => (
                  <div className="mt-3 " key={c._id}>
                    <Checkbox
                      onChange={(e) => { handleCategoryFilter(c._id, e.target.checked); showMessage(`${c.name}`); }}
                      checked={checkedCategories.includes(c._id)}
                    >
                      {c.name}
                    </Checkbox>
                  </div>
                ))}
              </div>
              <div className="d-block">
                <h4 className="">Filter Price</h4>
                <div className="mb-2">
                  <Radio.Group onChange={(e) => { handlePriceFilter(e.target.value); showMessage(`price ${e.target.set}`); }}>
                    {priceFilter?.map((p) => (
                      <div className="mb-2" key={p._id}>
                        <Radio value={p.array} set={p.name}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
              </div>
              <button onClick={handleFilter} type="button" className="btn btn-outline-success btn-sm w-25 h-25">Reset Filters</button>
            </div>
          </details>
        </div>
        <div className="row">
          <div className="col-md-12">
            {loading ? (
              <div className="text-center mb-5">
                <Spin size="large" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mb-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="col">
                    <div className="card mb-5 shadow">
                      <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          maxHeight: '250px',
                        }}
                      />
                      <div className="card-body shadow">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text ">
                          {product.description &&
                            (product.description.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description)}
                        </p>
                        <h6 className="card-text">Rs.{product.price}</h6>
                        <p className="card-text">
                          {product.quantity ? 'In stock' : 'Out of Stock'}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <button type="button" className="btn btn-primary btn-sm">
                            More Details
                          </button>
                          <button
                            onClick={() => {
                              const existingItem = cart.find((item) => item._id === product._id);
                              if (!existingItem) {
                                setCart([...cart, { ...product, quantity: 1 }]);
                                localStorage.setItem("cart", JSON.stringify([...cart, { ...product, quantity: 1 }]));
                                navigate('/cart');
                                toast.success('Item added to cart');
                              } else {
                                toast.info('Item already in cart');
                              }
                            }}
                            type="button"
                            className={`btn btn-secondary btn-sm ${product.quantity ? '' : 'disabled'}`}
                            disabled={!product.quantity}
                          >
                            {product.quantity ? 'Add to Cart' : 'Not Available'}
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mb-4">No products found.</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
