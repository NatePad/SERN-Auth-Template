import { useState, useEffect } from 'react';
import {
    validateUsername, invalUsernameMsg,
    validateEmail, invalEmailMsg
  } from './InputValidator';

const useProfileModel = () => {
  const [usernameState, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(true);
  const [emailState, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);

  useEffect(() => {
    setValidUsername(validateUsername(usernameState));
  }, [usernameState]);

  useEffect(() => {
    setValidEmail(validateEmail(emailState));
  }, [emailState]);

  return {
    username: {
      invalMsg: invalUsernameMsg,
      valid: validUsername,
      value: usernameState,

      formInput: {
        onChange: e => setUsername(e.target.value),
        placeholder: 'Username',
        type: 'text',
        value: usernameState
      }
    },

    email: {
      invalMsg: invalEmailMsg,
      valid: validEmail,
      value: emailState,

      formInput: {
        onChange: e => setEmail(e.target.value),
        placeholder: 'Email',
        type: 'email',
        value: emailState
      }
    }
  }
}

export default useProfileModel;