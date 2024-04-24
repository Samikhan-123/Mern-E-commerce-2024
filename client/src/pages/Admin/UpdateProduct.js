import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState(null); // Changed to null initially
    const [id, setId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // State for submitting status


    //get single product id
    const getSingleProduct = async () => {
        try {
            const apiUrl = `/api/v1/product/get-product/${params.slug}`;
            console.log('API URL:', apiUrl); 

            const { data } = await axios.get(apiUrl);
            console.log('API Response:', data);

            if (data?.success) {
                setId(data?.product._id);
                setCategories(data?.product.categories);
                setName(data?.product.name);
                setDescription(data?.product.description);
                setPrice(data?.product.price);
                setQuantity(data?.product.quantity);
                setCategory(data?.product.category);
                setShipping(data?.product.shipping);
                setPhoto(data?.product.photo);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting product");
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, []);

    //get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    //create product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            if (photo) { // Check if photo is selected before appending to form data
                productData.append("photo", photo);
            }
            productData.append("category", category._id);

            const { data } = await axios.put(
                `/api/v1/product/update-product/${id}`,
                productData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (data?.success) {
                toast.success(data?.message);
                navigate("/dashboard/admin/products");
            } else {
                toast.error('Issue updating product');
            }
        } catch (error) {
            console.log(error.response.data.error);
            toast.error(error.response.data.error || "Something went wrong");
        } finally {
            setIsSubmitting(false); // Set submitting back to false when update process is finished
        }
    };
    const handleDelete = async () => {
        try {
            const answer = window.prompt('Are you sure you want to delete this product? Please enter "yes" or "no"');
            if (answer && answer.toLowerCase() === 'yes') {
                const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
                toast.success('Product successfully deleted');
                navigate("/dashboard/admin/products");
            } else if (answer && answer.toLowerCase() === 'no') {
                navigate('/dashboard/admin/products');
                toast.info('You chose not to delete the product.');
            } else {
                alert('Invalid answer. Please enter "yes" or "no".');
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong while deleting the product.');
        }

    }
    const handleNavigateHome = () => {
        navigate("/dashboard/admin/products");
    };

    return (
        <Layout title={"Dashboard - Update Product"}>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select
                                bordered={false}
                                placeholder="Select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => {
                                    setCategory(value);
                                }}
                                value={category ? category.name : null}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                        required
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img
                                            src={`/api/v1/product/product-photo/${id}`}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                )}

                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="Write a name"
                                    className="form-control"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    type="text"
                                    value={description}
                                    placeholder="Write a description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="Write a Price"
                                    className="form-control"
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="Write a quantity"
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <Select
                                    bordered={false}
                                    placeholder="Select Shipping "
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    onChange={(value) => {
                                        setShipping(value);
                                    }}
                                    value={shipping ? 'Yes' : 'No'}
                                    required
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="d-flex gap-3">
                                <button className="btn btn-primary" disabled={isSubmitting}

                                    onClick={handleUpdate}>
                                    {isSubmitting ? 'Updating...' : 'UPDATE PRODUCT'}
                                </button>

                                <button className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>

                                <button className="btn btn-dark" onClick={handleNavigateHome}>
                                    Go Back
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;
