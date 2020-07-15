import { useState, useEffect } from 'react';
import {
  validateEmail, invalEmailMsg
} from '../InputValidator';

const useEmailModel = () => {
  const [emailState, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);

  useEffect(() => {
    setValidEmail(validateEmail(emailState));
  }, [emailState]);

  return {
    email: {
      invalMsg: invalEmailMsg,
      setValue: newEmail => setEmail(newEmail),
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

export default useEmailModel;