import { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Form,
  Modal
} from 'react-bootstrap';

import API from '../utils/API';
import Email from '../components/UserProfileInputs/Email';
import Password from '../components/UserProfileInputs/Password';
import Username from '../components/UserProfileInputs/Username';

const Register = () => {
  const [validPassword, setValidPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validUsername, setValidUsername] = useState(false);

  const [completeForm, setCompleteForm] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('');

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

      results.status === 201
        ? setModalText(`Your account has been created successfully, ${results.data.username}!`)
        : setModalText('Either the provided username or email address is already being used.')

      setModalShow(true);
    } catch (err) {
      setModalText('There was an error creating your account. Please try again later.');
      setModalShow(true);
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

      {/* RESPONSE MODAL */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Body>

          <p>{modalText}</p>

          <Button variant="primary" onClick={() => setModalShow(false)}>
            Close
          </Button>

        </Modal.Body>
      </Modal>

    </Container>
  )
}

export default Register;
