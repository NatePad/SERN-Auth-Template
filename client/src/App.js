import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import { StoreProvider } from './utils/GlobalState';

import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
  );
}

export default App;
