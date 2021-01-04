import { createContext, useContext, useReducer } from 'react';

import {
  LOGIN,
  LOGOUT
} from './actions';

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {
  switch (action.action) {

    case LOGIN:
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
        ...state,
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
