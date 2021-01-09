import { useEffect, useState } from 'react';

import { Form } from 'react-bootstrap';

// CONSTANT VARIABLES
// EMAIL REQUIREMENTS
const EMAIL_MAX_LEN = 350;
const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;


const Email = props => {
  const [email, setEmail] = useState();
  const [valid, setValid] = useState();

  // VALIDATOR
  useEffect(() => {
    setValid(EMAIL_REGEX.test(email) && email.length < EMAIL_MAX_LEN);
  }, [email]);

  useEffect(() => {
    props.setValid(valid);
    // eslint-disable-next-line
  }, [valid]);

  return (
    <Form.Group controlId="email">
      <Form.Label>Email Address:</Form.Label>
      <Form.Control
        type="email"
        placeholder="your@email.com"
        onChange={e => setEmail(e.target.value.trim())}
      />
      <Form.Text className={valid ? `invisible` : 'text-danger'}>
        Please enter a valid email address.
      </Form.Text>
    </Form.Group>
  )
}

export default Email;
