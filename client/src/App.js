import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
