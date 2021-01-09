import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';


// CONSTANT VARIABLES
// PASSWORD REQUIREMENTS
const PASSWORD_MAX_LEN = 128;
const PASSWORD_MIN_LEN = 8;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

const INVAL_PASSWORD_MSG = 'Passwords need to be at least 8 characters and ' +
  'contain both a lower and uppercase letter, a number, and a special character.'


// VALIDATION
const validatePassword = password => {
  let valid = PASSWORD_REGEX.test(password);

  if (password.length < PASSWORD_MIN_LEN || password.length > PASSWORD_MAX_LEN)
    valid = false;

  return valid;
}


// COMPONENT
const Password = props => {
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);

  useEffect(() => {
    setValidPassword(validatePassword(password));
  }, [password]);

  useEffect(() => {
    setValidConfirmPassword(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    props.setValid(validPassword && validConfirmPassword);

    // eslint-disable-next-line
  }, [validPassword, validConfirmPassword]);

  return (
    <>
      <Form.Group controlId="password">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="P@ssw0rd!"
          onChange={e => setPassword(e.target.value.trim())}
        />
        <Form.Text className={validPassword ? 'invisible' : 'text-danger'}>
          {INVAL_PASSWORD_MSG}
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm Your Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="P@ssw0rd!"
          onChange={e => setConfirmPassword(e.target.value.trim())}
        />
        <Form.Text className={validConfirmPassword ? 'invisible' : 'text-danger'}>
          Your passwords do not match.
        </Form.Text>
      </Form.Group>
    </>
  )
}

export default Password;
