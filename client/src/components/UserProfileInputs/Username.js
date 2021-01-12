import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useStoreContext } from '../../utils/GlobalState';

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

const Username = props => {
  const [state] = useStoreContext();
  const [username, setUsername] = useState(state.user.username || '');
  const [valid, setValid] = useState(true);
  const [invalMsg, setInvalMsg] = useState(INVAL_MSG);
  const [msgColor, setMsgColor] = useState('invisible');

  const debouncedTerm = useDebounce(username, 500);

  // VALIDATOR
  useEffect(() => {
    let valid = username.length >= USERNAME_MIN_LEN &&
      username.length <= USERNAME_MAX_LEN;

    const lowerName = username.toLowerCase();
    for (let i = 0; i < lowerName.length; i++) {
      if (!VALID_CHARS.includes(lowerName.charAt(i))) valid = false;
    }

    setValid(valid);
  }, [username]);

  useEffect(() => {
    if (username === state.user.username) return;
    if (valid && username !== '') queryUsername();
    // eslint-disable-next-line
  }, [debouncedTerm]);

  useEffect(() => {
    if (!valid) {
      setInvalMsg(INVAL_MSG);
      setMsgColor('text-danger');
    }

    if (props.setValid) props.setValid(valid);
    // eslint-disable-next-line
  }, [valid]);

  useEffect(() => {
    if (props.readOnly) setUsername(state.user.username);
    // eslint-disable-next-line
  }, [props.readOnly]);

  const queryUsername = async () => {
    const res = await API.findByUsername(username);
    if (res.data.username) {
      setValid(false);
      setMsgColor('text-danger');
      setInvalMsg(`The username ${username} is taken.`);
    } else {
      setValid(true);
      setMsgColor('text-success');
      setInvalMsg(`The username ${username} is available!`);
    }
  };

  return (
    <Form.Group controlId="username">
      <Form.Label>Username:</Form.Label>
      <Form.Control
        type="username"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value.trim())}
        readOnly={props.readOnly || false}
        plaintext={props.readOnly || false}
      />
      <Form.Text
        className={username === state.user.username ? 'invisible' : msgColor}
      >
        {invalMsg}
      </Form.Text>
    </Form.Group>
  );
};

export default Username;
