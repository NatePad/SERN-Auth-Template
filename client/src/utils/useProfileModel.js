import { useState, useEffect } from 'react';
import {
    validateUsername, invalUsernameMsg
  } from './InputValidator';

const useProfileModel = () => {
  const [usernameState, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(true);

  useEffect(() => {
    setValidUsername(validateUsername(usernameState));
  }, [usernameState]);

  return {
    username: {
      invalMsg: invalUsernameMsg,
      valid: validUsername,

      formInput: {
        onChange: e => setUsername(e.target.value),
        placeholder: 'Username',
        type: 'text',
        value: usernameState
      }
    }
  }
}

export default useProfileModel;