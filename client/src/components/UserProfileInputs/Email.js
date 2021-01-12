import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useStoreContext } from '../../utils/GlobalState';

// CONSTANT VARIABLES
// EMAIL REQUIREMENTS
const EMAIL_MAX_LEN = 350;
const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

const Email = props => {
  const [state] = useStoreContext();
  const [email, setEmail] = useState(state.user.email || '');
  const [valid, setValid] = useState(true);

  // VALIDATOR
  useEffect(() => {
    setValid(EMAIL_REGEX.test(email) && email.length < EMAIL_MAX_LEN);
  }, [email]);

  useEffect(() => {
    if (props.setValid) props.setValid(valid);
    // eslint-disable-next-line
  }, [valid]);

  useEffect(() => {
    if (props.readOnly) setEmail(state.user.email);
    // eslint-disable-next-line
  }, [props.readOnly]);

  return (
    <Form.Group controlId="email">
      <Form.Label>Email Address:</Form.Label>
      <Form.Control
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value.trim())}
        readOnly={props.readOnly || false}
        plaintext={props.readOnly || false}
      />
      <Form.Text className={valid ? `invisible` : 'text-danger'}>
        Please enter a valid email address.
      </Form.Text>
    </Form.Group>
  );
};

export default Email;
