import { useEffect, useState } from 'react';

import { Button, Container, Form, Modal } from 'react-bootstrap';

import {
  PROFILE_UPDATE
} from '../utils/actions';

import { useStoreContext } from '../utils/GlobalState';

import API from '../utils/API';
import CurrentPassword from '../components/UserProfileInputs/CurrentPassword';
import Email from '../components/UserProfileInputs/Email';
import Username from '../components/UserProfileInputs/Username';


const Profile = () => {
  const [state, dispatch] = useStoreContext();

  const [validUsername, setValidUsername] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [correctPassword, setCorrectPassword] = useState(true);
  const [validForm, setValidForm] = useState(true);

  const [readOnly, setReadOnly] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // current password element cannot be saved as it isn't on the page yet
  const usernameEl = document.querySelector('#username');
  const emailEl = document.querySelector('#email');

  useEffect(() => {
    setValidForm(validUsername && validEmail);
  }, [validUsername, validEmail]);

  useEffect(() => {
    if (showModal) document.querySelector('#current-password').focus();
  }, [showModal]);

  const getPassword = e => {
    e.preventDefault();

    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();

    if (username === state.user.username && email === state.user.email) {
      alert("Your information hasn't changed.");
      return;
    }

    setShowModal(true);
  }

  const updateProfile = async e => {
    e.preventDefault();

    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();
    const password = document.querySelector('#current-password').value.trim();

    const userData = {
      username,
      email,
      password
    }

    const res = await API.updateProfile(userData);
    if (res.data === 'INCORRECT_PASSWORD') {
      setCorrectPassword(false);
    } else if (res.data === 'UPDATED') {
      dispatch({
        action: PROFILE_UPDATE,
        data: { username, email }
      });
      setShowModal(false);
      setReadOnly(true);
      alert('Your information was updated successfully!');
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
          ? <Button variant="primary" onClick={() => setReadOnly(false)}>
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
                onClick={() => setReadOnly(true)}
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
