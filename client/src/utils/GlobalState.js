import { createContext, useContext, useReducer } from 'react';
import {
  AUTH_CHECK_COMPLETE,
  LOGIN,
  LOGOUT,
  PROFILE_UPDATE
} from './actions';

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.action) {

    case AUTH_CHECK_COMPLETE:
      return {
        ...state,
        authCheckComplete: true
      };

    case LOGIN:
      return {
        ...state,
        user: {
          auth: true,
          ...action.data
        }
      };

    case LOGOUT:
      document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      return {
        authCheckComplete: true,
        user: {
          auth: false
        }
      };

    case PROFILE_UPDATE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.data
        }
      };

    default:
      return state;
  }
};

const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useReducer(reducer, {
    authCheckComplete: false,
    user: {
      auth: false
    }
  });
  return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
