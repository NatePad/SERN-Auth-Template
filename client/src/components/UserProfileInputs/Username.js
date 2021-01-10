import { useEffect, useState } from 'react';

import { Form } from 'react-bootstrap';

import API from '../../utils/API';
import useDebounce from '../../utils/debounceHook';

// CONSTANT VARIABLES
// USERNAME REQUIREMENTS
const USERNAME_MAX_LEN = 35;
const USERNAME_MIN_LEN = 6;
const INVAL_MSG =
  `Usernames can be ${USERNAME_MIN_LEN} to ${USERNAME_MAX_LEN} characters ` +
  `long and can contain letters (a-z), numbers (0-9), and periods (.).`;
const VALID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz.';


// VALIDATOR
const validateUsername = username => {
  let valid = username.length >= USERNAME_MIN_LEN
    && username.length <= USERNAME_MAX_LEN;

  const lowerName = username.toLowerCase();
  for (let i = 0; i < lowerName.length; i++) {
    if (!VALID_CHARS.includes(lowerName.charAt(i))) valid = false;
  }

  return valid;
}


// COMPONENT
const Username = props => {
  const [username, setUsername] = useState('');
  const [valid, setValid] = useState(false);
  const [msgColor, setMsgColor] = useState('text-danger');
  const [invalMsg, setInvalMsg] = useState(INVAL_MSG);

  const debouncedTerm = useDebounce(username, 500);

  const queryUsername = async () => {
    const results = await API.findByUsername(username);
    if (results.data.username) {
      setValid(false);
      setMsgColor('text-danger');
      setInvalMsg(`The username ${username} is taken.`);
    } else {
      setValid(true);
      setMsgColor('text-success');
      setInvalMsg(`The username ${username} is available!`);
    }
  }

  useEffect(() => {
    if (valid) {
      queryUsername();
    }
    // eslint-disable-next-line
  }, [debouncedTerm]);

  useEffect(() => {
    setValid(validateUsername(username));
  }, [username]);

  useEffect(() => {
    if (!valid) {
      setInvalMsg(INVAL_MSG);
      setMsgColor('text-danger');
    }
    props.setValid(valid);
    // eslint-disable-next-line
  }, [valid]);

  return (
    <Form.Group controlId="username">
      <Form.Label>Username:</Form.Label>
      <Form.Control
        type="username"
        placeholder="Username"
        onChange={e => setUsername(e.target.value.trim())}
      />
      <Form.Text className={msgColor}>
        {invalMsg}
      </Form.Text>
    </Form.Group>
  )
}

export default Username;
