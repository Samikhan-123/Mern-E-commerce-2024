import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './../components/Layout/Layout';
import { Spin } from 'antd'; //  Ant Design for the  component

const CategoryProduct = () => {
    const params = useParams();
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // get product on the base of single category 
    const getSingleCategoryProducts = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/category-products/${params.slug}`)
            setCategory(data?.category || {});
            setProducts(data?.products || []);
            setLoading(false); // Set loading to false after products are loaded
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products. Please try again later.');
            setLoading(false); // Set loading to false in case of error
        }
    }

    useEffect(() => {
        if (params?.slug) {
            getSingleCategoryProducts();
        }
    }, [params.slug]);

    return (
        <Layout>
            <h2 className='text-center p-4 mt-4 mb-2'>
               Category - {category.name || "Loading..."}
            </h2>
            {loading ? (
                <div className="text-center">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <div className="text-center text-danger">
                    {error}
                </div>
            ) : (
                <>
                    <h6 className='text-center mb-4'>
                        {products.length} results found
                    </h6>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                    {products.map(product => (
                                        <div key={product._id} className="col">
                                            {/*  product card here */}
                                            <div className="card mb-4 mt-4 shadow">
                                                <img
                                                    src={`/api/v1/product/product-photo/${product._id}`}
                                                    className="card-img-top"
                                                    alt={product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center',
                                                        maxHeight: '250px',
                                                    }}
                                                />
                                                <div className="card-body">
                                                    <h5 className="card-title">{product.name}</h5>
                                                    <p className="card-text">{product.description && product.description.length > 30 ? product.description.substring(0, 30) + '...' : product.description}</p>
                                                    <h6 className="card-text">Rs.{product.price}</h6>
                                                    <p className="card-text">Availability: {product.quantity ? product.quantity : 'Out of Stock'}</p>
                                                    <div className="d-flex gap-2">
                                                        <button type="button" className={`btn btn-primary `}>More Details</button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-secondary ${product.quantity ? '' : 'disabled'}`}
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
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default CategoryProduct;
