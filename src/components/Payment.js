import React, { useState, useEffect } from 'react';
import './css/Payment.css';
import { Link, useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from '../StateProvider';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from '../reducer';
import { instance } from '../axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { db } from '../firebase';


function Payment() {
    const history = useHistory();  
    const [{basket, user}, dispatch] = useStateValue();
    
    const stripe = useStripe();
    const elements = useElements();
    
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientsecret, setClientsecret] = useState(true);

    useEffect(() => {
        // generate a special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await instance({
                method: 'post',
                // Stripe expects the total in a currencies submits
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientsecret(response.data.clientsecret);
        }


        getClientSecret();
    }, [basket])

    console.log('The client secret is >>>', clientsecret)

    const handleSubmit = async (event) => {
        // do all the fancy stripe stuff...
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientsecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent == payment confirmation
            db
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                })
            
            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders')
        })

    }

    const handleChange = event => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>Las Americas 2</p>
                        <p>Mérida, Yucatan</p>
                    </div>
                </div>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item => (
                            <CheckoutProduct 
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating }
                            /> 
                        ))}
                    </div>
                </div>

                {/* Payment section - Payment Method */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                            <form onSubmit={handleSubmit}>
                                <CardElement className="payment__card" onChange={handleChange} />

                                <div className="payment__priceContainer">
                                <CurrencyFormat 
                                    renderText={(value) => (
                                    <>
                                       <h3>Order Total: {value}</h3>
                                    </>  
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                                </div>

                                {error && <div>{error}</div>}
                            </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment;
