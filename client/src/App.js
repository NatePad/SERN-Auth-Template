import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import { StoreProvider } from './utils/GlobalState';

import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Login} />
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
