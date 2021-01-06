import { createContext, useContext, useReducer } from 'react';

import {
  AUTH_CHECK_COMPLETE,
  LOGIN,
  LOGOUT
} from './actions';

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.action) {


    case AUTH_CHECK_COMPLETE:
      return {
        ...state,
        authCheckComplete: true
      }


    case LOGIN:
      if (action.data.token)
        document.cookie = `user=${action.data.token}; SameSite=Strict`;

      return {
        ...state,
        user: {
          auth: true,
          ...action.data.userData
        }
      }


    case LOGOUT:
      document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      return {
        user: {
          auth: false
        }
      }


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
