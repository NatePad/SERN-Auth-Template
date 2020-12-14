import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
