import { useEffect, useState } from 'react';

import { Button, Container, Form, Modal } from 'react-bootstrap';

import { useStoreContext } from '../utils/GlobalState';

import API from '../utils/API';
import CurrentPassword from '../components/UserProfileInputs/CurrentPassword';
import Username from '../components/UserProfileInputs/Username';
import Email from '../components/UserProfileInputs/Email';

const Profile = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();
  const [readOnly, setReadOnly] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [correctPassword, setCorrectPassword] = useState(true);
  const [validForm, setValidForm] = useState(true);

  useEffect(() => {
    setValidForm(validUsername && validEmail);
  }, [validUsername, validEmail]);

  useEffect(() => {
    if (showModal) document.querySelector('#current-password').focus();
  }, [showModal]);

  const getPassword = e => {
    e.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();

    if (username === state.user.username && email === state.user.email) {
      alert("Your information hasn't changed.");
      return;
    }

    setShowModal(true);
  }

  const updateProfile = async e => {
    e.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#current-password').value.trim();

    const userData = {
      username,
      email,
      password
    }

    const results = await API.updateProfile(userData);
    if (results.data === 'INCORRECT_PASSWORD') {
      setCorrectPassword(false);
    }
  }


  return (
    <Container>
      <h1>Your Profile:</h1>

      <Form className="mb-4" onSubmit={getPassword}>
        <Username readOnly={readOnly} setValid={setValidUsername} />
        <Email readOnly={readOnly} setValid={setValidEmail} />

        {readOnly

          // Edit My Information Button
          ? <Button variant="primary" onClick={() => setReadOnly(!readOnly)}>
              Edit My Information
            </Button>

          // Submit or Cancel buttons
          : (
            <>
              <Button variant="success" type="submit" disabled={!validForm}>
                Submit
              </Button>
              <Button
                className="ml-5"
                variant="danger"
                onClick={() => setReadOnly(!readOnly)}
              >
                Cancel
              </Button>
              <Form.Text className={validForm ? 'invisible' : 'text-danger'}>
                Please fix all form errors before submitting.
              </Form.Text>
            </>
          )
        }

      </Form>

      <Button className={readOnly ? 'mt-4' : ''} variant="warning" disabled>
        Change my Password
      </Button>


      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <Form onSubmit={updateProfile}>

            <CurrentPassword
              correct={correctPassword}
              setCorrect={setCorrectPassword}
            />

            <Button variant="success" type="submit">
              Submit
            </Button>

            <Button variant="danger" className="ml-5" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Profile;
