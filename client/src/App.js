import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import API from './utils/API';
import AuthCheckContext from './utils/AuthCheckContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import ResetPass from './pages/ResetPass';
import UserContext from './utils/UserContext';

function App() {

  const [authCheck, setAuthCheck] = useState({
    complete: false
  });

  const [userState, setUserState] = useState({
    authenticated: false
  });

  useEffect(() => {
    // This check happens both here to reduce
    // API calls and again on the back end for safety.
    if (!document.cookie || !document.cookie.includes('user=')) {
      setAuthCheck({ complete: true });
      return;
    }

    API.auth()
      .then(res => {
        if (res.data.email) {
          setUserState({ authenticated: true, ...res.data });
          return;
        }

        // Possible responses:
        // JWT_ERROR
        // SERVER_ERROR
        // USER_DELETED
        switch (res.data) {
          case 'SERVER_ERROR':
            console.log('Server side error authenticating user.');
            break;
          case 'JWT_ERROR':
            console.log('It looks like the JWT_SECRET changed.');
            break;
          case 'USER_DELETED':
            document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            break;
          default:
            console.log('Unexpected response from server.');
        }
      })
      .catch(err => {
        console.log('Uh oh! Something went wrong.');
      })
      .finally(() => {
        setAuthCheck({ complete: true });
      });

  }, []);

  return (
    <AuthCheckContext.Provider value={{ authCheck }}>
      <UserContext.Provider value={{ userState, setUserState }}>

        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/reset-pass/:id/:resetCode" component={ResetPass} />
            <ProtectedRoute exact path="/profile" component={Profile} />
            <Route component={Home} />
          </Switch>
        </Router>

      </UserContext.Provider>
    </AuthCheckContext.Provider>
  )
}

export default App;
