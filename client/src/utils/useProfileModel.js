import { useState, useEffect } from 'react';
import {
    validateUsername, invalUsernameMsg,
    validateEmail, invalEmailMsg,
    validatePassword, invalPasswordMsg
  } from './InputValidator';

const useProfileModel = () => {
  const [usernameState, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(true);
  const [emailState, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [passwordState, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [confirmPasswordState, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);

  useEffect(() => {
    setValidUsername(validateUsername(usernameState));
  }, [usernameState]);

  useEffect(() => {
    setValidEmail(validateEmail(emailState));
  }, [emailState]);

  useEffect(() => {
    setValidPassword(validatePassword(passwordState));
  }, [passwordState]);

  useEffect(() => {
    setValidConfirmPassword(passwordState === confirmPasswordState
      || confirmPasswordState.length < 1);
  }, [passwordState, confirmPasswordState]);

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
    },

    password: {
      invalMsg: invalPasswordMsg,
      valid: validPassword,
      value: passwordState,

      formInput: {
        onChange: e => setPassword(e.target.value),
        placeholder: 'P@55w0rd!',
        type: 'password',
        value: passwordState
      }
    },

    confirmPassword: {
      invalMsg: 'Your passwords do not match.',
      valid: validConfirmPassword,
      value: confirmPasswordState,

      formInput: {
        onChange: e => setConfirmPassword(e.target.value),
        placeholder: 'Enter Password Again',
        type: 'password',
        value: confirmPasswordState
      }
    }
  }
}

export default useProfileModel;