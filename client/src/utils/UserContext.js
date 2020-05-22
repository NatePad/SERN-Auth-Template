import { createContext } from 'react';

const UserContext = createContext({
  authenticated: false
});

export default UserContext;
