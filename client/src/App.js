import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import UserContext from './utils/UserContext';

function App() {

  const [userState, setUserState] = useState({
    authenticated: false
  });

  return (
    <UserContext.Provider value={{ userState, setUserState }}>

      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route component={Home} />
        </Switch>
      </Router>
      
    </UserContext.Provider>
  );
}

export default App;
