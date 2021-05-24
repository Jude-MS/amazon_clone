const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51HiwLEDaLHFbI9Ysjd6I5gYUwr41B91DTRzsqGOWwc5REjuXjRqt3QzSO4m1kRT8oWGHNd5gpvqFQZbpNM3AnohA00sdI2rgMt')

// API

// - App config
const app = express();

// - Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// - API routes
app.get('/', (req, res) => res.status(200).send('Hello world'))

app.post('/payments/create', async (req, res) => {
    const total = req.query.total;

    console.log('Payment Request Received BOOM!!! for this amount >>>', total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, //subunits of the currency
        currency: "usd"
    });

    // Ok - Created
    res.status(201).send({
        clientsecret: paymentIntent.client_secret
    })
    
})

// - Listen command
exports.api = functions.https.onRequest(app);

// Example endpoint
// http://localhost:5001/clone-9ad41/us-central1/api
