import { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import {
  AUTH_CHECK_COMPLETE,
  LOGIN
} from './utils/actions';

import { useStoreContext } from './utils/GlobalState';

import API from './utils/API';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PasswordReset from './pages/PasswordReset';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

const App = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  const cookieLogin = async () => {
    if (document.cookie.includes('user=')) {
      const res = await API.loginCookie();
      if (res.data.username) {
        dispatch({
          action: LOGIN,
          data: res.data
        });
      }
    }

    dispatch({
      action: AUTH_CHECK_COMPLETE
    });
  }

  useEffect(() => {
    cookieLogin();
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        <Route exact path="/pass-reset/:resetCode" component={PasswordReset} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
