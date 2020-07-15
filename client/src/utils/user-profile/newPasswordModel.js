import { useState, useEffect } from 'react';
import {
  validatePassword, invalPasswordMsg
} from '../InputValidator';

const useNewPasswordModel = () => {
  const [passwordState, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [confirmPasswordState, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);

  useEffect(() => {
    setValidPassword(validatePassword(passwordState));
  }, [passwordState]);

  useEffect(() => {
    setValidConfirmPassword(passwordState === confirmPasswordState
      || confirmPasswordState.length < 1);
  }, [passwordState, confirmPasswordState]);

  return {
    newPassword: {
      invalMsg: invalPasswordMsg,
      reset: () => setPassword(''),
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
      reset: () => setConfirmPassword(''),
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

export default useNewPasswordModel;