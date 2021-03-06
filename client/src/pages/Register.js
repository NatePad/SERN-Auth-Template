import { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { LOGIN } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';

import API from '../utils/API';
import Email from '../components/UserProfileInputs/Email';
import NewPassword from '../components/UserProfileInputs/NewPassword';
import Username from '../components/UserProfileInputs/Username';

const Register = props => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();
  const [validPassword, setValidPassword] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validUsername, setValidUsername] = useState(true);
  const [validForm, setValidForm] = useState(true);

  useEffect(() => {
    setValidForm(validEmail && validPassword && validUsername);
  }, [validEmail, validPassword, validUsername]);

  const handleSubmit = async e => {
    e.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#new-password').value.trim();

    const userData = { username, email, password };
    try {
      const res = await API.register(userData);
      if (res.status === 201) {
        await API.login(userData);
        dispatch({
          action: LOGIN,
          data: { username, email }
        });

        alert(`Your account has been created and you've been logged in, ` +
          `${username}! You will now be directed to the secure profile page.`);

        props.history.push('/profile');
      } else { // response is 'NOT_UNIQUE'
        alert(
          'Either the provided username or email address is already being used.'
        );
      }
    } catch (err) {
      alert(
        'There was an error creating your account. Please try again later.'
      );
    }
  };

  return (
    <Container>
      <h1>Register for an Account:</h1>
      <Form onSubmit={handleSubmit}>
        <Username setValid={setValidUsername} />
        <Email setValid={setValidEmail} />
        <NewPassword setValid={setValidPassword} />
        <Button variant="primary" type="submit" disabled={!validForm}>
          Submit
        </Button>
        <Form.Text className={validForm ? 'invisible' : 'text-danger'}>
          Please fix all form errors before submitting.
        </Form.Text>
      </Form>
    </Container>
  );
};

export default Register;
