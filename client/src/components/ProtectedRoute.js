import { Route, Redirect } from 'react-router-dom';

import { useStoreContext } from '../utils/GlobalState';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  return (
    <Route {...rest} render={props => (
      state.user.auth
      ? <Component {...props} />
      : <Redirect to="/login" />
    )} />
  )
}

export default ProtectedRoute;
