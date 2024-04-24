import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';

const Category = () => {
    const categories = useCategory();
  

    return (
        <Layout title='All Categories'>
            <h1 className='text-center p-4 mt-4 mb-4'>Category</h1>
            <div className="container">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {categories.map((c, index) => (
                        <div className="col mb-4" key={c._id}>
                            <Link to={`/category/${c.slug}`} className="card-link text-decoration-none text-white">
                                <div className="card h-100">
                                    {/* <img src={'https://images.unsplash.com/photo-1583039949165-96ee24b0d8de?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} className="card-img-top" alt={c.name} /> */}
                                    <div className="card-body">
                                        <h5 className="card-title text-dark">{c.name}</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Category;
