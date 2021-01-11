import { useState } from 'react';

import { Button, Container, Form } from 'react-bootstrap';

import Password from '../components/UserProfileInputs/Password';
import API from '../utils/API';

const PasswordReset = props => {
  const [validPassword, setValidPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const { resetCode } = props.match.params;

    const results = await API.passwordReset({
      password: document.querySelector('#password').value.trim(),
      resetCode
    });

    results.data === 'SUCCESS'
      ? alert('Your password has been successfully updated!')
      : alert('There was either an error with the link, or it has expired. ' +
        'Please try again.')
  }

  return (
    <Container>
      <h1>Reset Your Password</h1>
      <Form onSubmit={handleSubmit}>
        <Password setValid={setValidPassword} />
        <Button variant="primary" type="submit" disabled={!validPassword}>
          Submit
        </Button>
        <Form.Text className={validPassword ? 'invisible' : 'text-danger'}>
          Please fix all form errors before submitting.
        </Form.Text>
      </Form>
    </Container>
  )
}

export default PasswordReset;
