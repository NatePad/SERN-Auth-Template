import { useState } from 'react';

import { Button, Container, Form } from 'react-bootstrap';

import NewPassword from '../components/UserProfileInputs/NewPassword';
import API from '../utils/API';

const PasswordReset = props => {
  const [validPassword, setValidPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const { resetCode } = props.match.params;

    const res = await API.passwordReset({
      password: document.querySelector('#new-password').value.trim(),
      resetCode
    });

    if (res.data === 'SUCCESS') {
      alert('Your password has been successfully updated and you will ' +
        'now be redirected to the login page!');
      props.history.push('/login');
    } else {
      alert('There was either an error with the link, or it has expired. ' +
        'Please try again.');
    }
  }

  return (
    <Container>
      <h1>Reset Your Password</h1>
      <Form onSubmit={handleSubmit}>
        <NewPassword setValid={setValidPassword} />
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
