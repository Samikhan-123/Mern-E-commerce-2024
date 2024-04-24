import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
// import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { Steps } from "antd";
import { Modal } from 'antd';

const CartPage = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(2);
    const { Step } = Steps;


    //total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price * item.quantity; // Multiply price by quantity
            });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Increment quantity
    const incrementQuantity = (pid) => {
        const updatedCart = cart.map((item) => {
            if (item._id === pid) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Decrement quantity
    const decrementQuantity = (pid) => {
        const updatedCart = cart.map((item) => {
            if (item._id === pid && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    //delete item
    const removeCartItem = (pid) => {
        try {
            const confirmed = window.confirm("Are you sure you want to remove this item from the cart?");
            if (!confirmed) {
                return false; // Return false if user cancels
            }

            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
            toast.success('Item removed');
            return true;
        } catch (error) {
            console.log(error);
            return false; // Return false if an error occurs
        }
    };

    // Clear cart
    const clearCart = () => {
        const confirmed = window.confirm("Are you sure you want to clear cart");
        if (!confirmed) {
            return false; // Return false if user cancels
        }
        setCart([]);
        localStorage.removeItem("cart");
        toast.success('Cart cleared');
    };

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/braintree/token");
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
            toast.error("Payment failed. Please try again."); // Notify user of the error
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // Request payment method from the Braintree Drop-in UI
            const { nonce } = await instance.requestPaymentMethod();

            const { data } = await axios.post("/api/v1/product/braintree/payment", {
                nonce,
                cart,
            });

            // Payment completed successfully
            localStorage.removeItem("cart");
            setCart([]);
            setLoading(false);
            setCurrentStep(3);
            setModalTitle('Payment Completed Successfully');
            setModalContent('Thank you for your purchase!');
            setModalVisible(true)
            // toast.success("Payment Completed Successfully");
        } catch (error) {
            setModalTitle('Payment failed. please try again!');
            console.error("Error processing payment:", error);
            setLoading(false);
            // Handle payment failure
            toast.error("Payment failed. Please try again.");
            // alert("Payment failed. Please try again.");
        }
    };
    const handleConfirm = () => {

        setModalVisible(false);
        navigate("/dashboard/user/orders");

    };
    
    const goShoppingButton = () => {
        navigate("/")
        window.scrollTo({
            top: 1000, // Scroll to 200px from the top
            behavior: 'smooth' // Smooth scrolling behavior
        });
    }
    

    return (
        <Layout>

            <div className="cart-page container py-4">
                <button onClick={goShoppingButton} className="cssbuttons-io-button mb-3" style={{ display: cart.length > 0 ? 'block' : 'none' }}>
                    Shopping more
                    <div className="icon">
                        <svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" />
                        </svg>
                    </div>
                </button>


                <h2 className="text-center mb-3 bg-light fw-bold">
                    {!auth?.user
                        ? "Hello Guest"
                        : `Hello  ${auth?.token && auth?.user?.name}`}
                </h2>
                <Modal
                    title={modalTitle}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={handleConfirm}
                >
                    <p>{modalContent}</p>
                </Modal>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-danger btn-sm" onClick={clearCart}>Clear Cart</button>
                </div>
                <h5 className="text-center m-4">
                    {cart.length > 0 ? `You have ${cart.length} items in your cart ${auth.token ? '' : '. Please login to checkout your cart'}` : "Your cart is empty"}
                </h5>
                {auth?.user && (
                    <>
                        <div className="row">
                            <div className="col-md-8">
                                {cart?.map((p) => (
                                    <div className="card shadow mb-3" key={p._id}>
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img
                                                    src={`/api/v1/product/product-photo/${p._id}`}
                                                    className="img"
                                                    alt={p.name}
                                                    style={{ height: '9rem' }}
                                                    width={200}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body d-flex align-items-center">
                                                    <div className="flex-grow-1">
                                                        <h5 className="card-title">{p.name}</h5>
                                                        <p className="card-text">{p.description &&
                                                            (p.description.length > 50
                                                                ? `${p.description.substring(0, 50)}...`
                                                                : p.description)}</p>
                                                        <p className="card-text">Rs {p.price}</p>
                                                    </div>
                                                    <div className="d-flex position-absolute top-0 end-0">
                                                        <button
                                                            className="btn btn-danger "
                                                            onClick={() => removeCartItem(p._id)}
                                                        >
                                                            <AiFillCloseCircle className="m-auto" size={20} />

                                                        </button>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            className="btn btn-danger m-2"
                                                            onClick={() => decrementQuantity(p._id)}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{p.quantity}</span>
                                                        <button
                                                            className="btn btn-primary m-2"
                                                            onClick={() => incrementQuantity(p._id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-md-4">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <h5 className="card-title">Cart Summary</h5>
                                        <hr />
                                        <Steps className="m-2" current={currentStep} size="small">
                                            <Step title="Cart" />
                                            <Step title="Checkout" />
                                            <Step title="Payment" />
                                        </Steps>
                                        <h6>Total: {totalPrice()}</h6>
                                        {auth?.user?.address ? (
                                            <>
                                                <p>Address: {auth?.user?.address}</p>
                                                <div className="alert alert-info" role="alert">
                                                    your order will be delivered on given address.
                                                </div>
                                            </>
                                        ) : (
                                            <p>Please update your address.</p>
                                        )}
                                        <button
                                            className="btn btn-primary btn-sm mt-3"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                        <div className="mt-2">
                                            {!clientToken || !auth?.token || cart.length === 0 ? (
                                                "") : (
                                                <>
                                                    <DropIn
                                                        options={{
                                                            authorization: clientToken,
                                                            paypal: {
                                                                flow: "vault",
                                                            },
                                                        }}
                                                        onInstance={(instance) => setInstance(instance)}
                                                    />

                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={handlePayment}
                                                        disabled={loading || !instance || !auth?.user?.address || cart.length < 1}
                                                    >
                                                        {loading ? (
                                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                                                <span className="visually-visible">Processing...</span>
                                                            </div>
                                                        ) : ("Make Payment")}
                                                    </button>

                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default CartPage;
