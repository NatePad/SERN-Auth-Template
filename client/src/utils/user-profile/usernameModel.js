import { useState, useEffect } from 'react';
import {
  validateUsername, invalUsernameMsg
} from '../InputValidator';
import API from '../API';
import useDebounce from '../debounceHook';

const useUsernameModel = () => {
  const [usernameState, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameInvalMsg, setUsernameInvalMsg] = useState(invalUsernameMsg);
  
  const debouncedTerm = useDebounce(usernameState);

  useEffect(() => {
    setValidUsername(validateUsername(usernameState));
  
    if (!validateUsername(usernameState)) {
      setUsernameInvalMsg(invalUsernameMsg);
      setUsernameAvailable(false);
      return;
    }
  }, [usernameState]);

  useEffect(() => {
    if (!usernameState || !validUsername) return;

    if (debouncedTerm) {
      API.checkUsername(usernameState)
        .then(res => {
          if (res.data === 'AVAILABLE') {
            setUsernameAvailable(true);
            setUsernameInvalMsg(`The username ${usernameState} is available!`)
          } else if (res.data === 'TAKEN') {
            setUsernameAvailable(false);
            setUsernameInvalMsg(`The username ${usernameState} is already taken.`)
          }
        })
        .catch(err => {
          console.log('Uh oh. Something went wrong.');
        });
    }
  }, [debouncedTerm]);

  return {
    username: {
      invalMsg: usernameInvalMsg,
      setValue: newName => setUsername(newName),
      valid: validUsername,
      value: usernameState,
      available: usernameAvailable,

      formInput: {
        onChange: e => setUsername(e.target.value),
        placeholder: 'Username',
        type: 'text',
        value: usernameState
      }
    }
  }
}

export default useUsernameModel;