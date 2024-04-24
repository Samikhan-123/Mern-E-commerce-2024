import React, { useState, useEffect } from 'react';
import AdminMenu from './../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Spin } from 'antd'; // Import Spin component from antd

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    //  get All Products
    const getAllProducts = async () => {
        try {
            const response = await axios.get('/api/v1/product/get-product');
            setProducts(response.data.products);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <Layout>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center m-5'>Admin - All Products List</h1>
                        {loading ? (
                            <div className="text-center">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                                {products.map((product) => (
                                    <Link
                                        className='product-link'
                                        key={product._id}
                                        to={`/dashboard/admin/product/${product.slug}`}
                                    >
                                        <div className="col mb-4">
                                            <div className="card shadow">
                                                <img style={{ width: '100%', height: '300px', position: 'left' }}
                                                    className="card-img-top" src={`/api/v1/product/product-photo/${product._id}`} alt={product.name} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{product.name}</h5>
                                                    <p className="card-text">{product.description && product.description.length > 30 ? product.description.substring(0, 30) + '...' : product.description}</p>
                                                    <h6 className="card-text">Rs.{product.price}</h6>
                                                    <p className="card-text">Availability : {product.quantity ? product.quantity : 'Out of Stock'}</p>
                                                    {/* <p className="card-text">{product._id}</p> */}
                                                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Products;
