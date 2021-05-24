import React, { useEffect } from 'react';
import './css/App.css';
import Header from './Header';
import Checkout from './Checkout';
import Home from './Home';
import Login from './Login';
import Payment from './Payment';
import Orders from './Orders';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { auth } from '../firebase';
import { useStateValue } from '../StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const promise = loadStripe('pk_test_51HiwLEDaLHFbI9YssArXpxkW97qqAUx6XMIAWMN8HDPd6gweIP5PXXlGchhewhsmnnvr7aaak0WGUtGt7Y78dwoo00d242J6ps');


function App() {
  const [{  }, dispatch] = useStateValue();

  useEffect(() => {
    //will only run once when the app component loads...
    auth.onAuthStateChanged(authUser => {
      console.log('THE USER IS >>> ', authUser);

      if (authUser) {
        // The user is logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        // The user is logged out
        dispatch({
          type: 'SET_USER',
          user: null 
        })
      }
    })
  }, [])

  return (
    <Router>
      <div className="app">
      <Switch> 
          <Route path="/login">
                <Login />
          </Route>

          <Route path="/orders">
              <Header /> 
              <Orders />
          </Route>

          <Route path="/checkout">
            <Header /> 
            <Checkout />
          </Route>

          <Route path="/payment">
            <Header /> 
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>

          <Route path="/">
            <Header /> 
            <Home />
          </Route>
        </Switch>
    </div>
    </Router>
  );
}

export default App;
