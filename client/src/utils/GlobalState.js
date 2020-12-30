import { createContext, useContext, useReducer } from 'react';

import {
  LOGIN,
  LOGOUT
} from './actions';

const StoreContext = createContext();
const { Provider } = StoreContext;

const reducer = (state, action) => {

  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {
          auth: true,
          ...action.userData
        }
      }
    
    case LOGOUT:
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
