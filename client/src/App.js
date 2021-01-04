import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

const App = () => {
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
