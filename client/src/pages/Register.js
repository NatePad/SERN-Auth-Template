import { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Form
} from 'react-bootstrap';

import { LOGIN } from '../utils/actions';

import { useStoreContext } from '../utils/GlobalState';

import API from '../utils/API';
import Email from '../components/UserProfileInputs/Email';
import Password from '../components/UserProfileInputs/Password';
import Username from '../components/UserProfileInputs/Username';

const Register = props => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();
  const [validPassword, setValidPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validUsername, setValidUsername] = useState(false);

  const [completeForm, setCompleteForm] = useState(false);

  useEffect(() => {
    setCompleteForm(validEmail && validPassword && validUsername)
  }, [validEmail, validPassword, validUsername]);


  // FORM SUBMISSION HANDLER
  const handleSubmit = async e => {
    e.preventDefault();

    const userData = {
      username: document.querySelector('#username').value.trim(),
      email: document.querySelector('#email').value.trim(),
      password: document.querySelector('#password').value.trim()
    }

    try {
      const results = await API.register(userData);
      if (results.status === 201) {
        await API.login(userData);
        const { username, email } = userData;
        dispatch({
          action: LOGIN,
          data: {
            username,
            email
          }
        });
        alert(`Your account has been created and you've been logged in, ` +
          `${userData.username}! You will now be directed to the secure ` +
          `profile page.`);
        props.history.push('/profile');
      } else {
        alert('Either the provided username or email address is already being used.');
      }
    } catch (err) {
      alert('There was an error creating your account. Please try again later.');
    }
  }


  return (
    <Container>

      <h1>Register for an Account:</h1>

      <Form onSubmit={handleSubmit}>

        <Username setValid={setValidUsername} />
        <Email setValid={setValidEmail} />
        <Password setValid={setValidPassword} />

        {/* SUBMIT BUTTON */}
        <Button variant="primary" type="submit" disabled={!completeForm}>
          Submit
        </Button>
        <Form.Text className={completeForm ? 'invisible' : 'text-danger'}>
          Please fix all form errors before submitting.
        </Form.Text>

      </Form>

    </Container>
  )
}

export default Register;
