import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from '../utils/UserContext';
import AuthCheckContext from '../utils/AuthCheckContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { userState } = useContext(UserContext);
  const { authCheck } = useContext(AuthCheckContext);

  if (!authCheck.complete) {
    return (<div className="container">Loading...</div>);
  }

  return (
    <Route {...rest} render={props => (
      userState.authenticated
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/login',
          state: {
            from: props.location
          }
        }} />
    )}
    />
  );
}

export default ProtectedRoute;