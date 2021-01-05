import { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import {
  AUTH_CHECK_COMPLETE,
  LOGIN
} from './utils/actions';

import API from './utils/API';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

import { useStoreContext } from './utils/GlobalState';

const App = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();


  const cookieLogin = async () => {

    if (document.cookie.includes('user=')) {
      try {
        const results = await API.loginCookie();
        if (results.data.userData) {
          dispatch({
            action: LOGIN,
            data: results.data
          });
        }
      } catch (err) { }
    }

    dispatch({
      action: AUTH_CHECK_COMPLETE
    });
  }


  useEffect(() => {
    cookieLogin();
    // eslint-disable-next-line
  }, [])


  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
