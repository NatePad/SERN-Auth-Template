import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Modal
} from 'react-bootstrap';
import API from '../utils/API';
import handleServerResponse from '../utils/handleServerResponse';
import UserState from '../utils/UserContext';
import useProfileModel from '../utils/user-profile/profileModel';
import FormGroup from '../components/FormGroup';

const Register = props => {
  const { userState, setUserState } = useContext(UserState);
  const { username, email, newPassword, confirmPassword } = useProfileModel();

  const [completeForm, setCompleteForm] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('Loading...');

  useEffect(() => {
    setCompleteForm(true);
  }, [username.value, email.value, newPassword.value, confirmPassword.value]);

  const closeModal = () => {
    setModalShow(false);
    if (userState.authenticated) props.history.push('/');
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (!username.valid || username.value.length < 1
      || !email.valid || email.value.length < 1
      || !newPassword.valid || newPassword.value.length < 1
      || !confirmPassword.valid || confirmPassword.value.length < 1) {
      setCompleteForm(false);
      return;
    }

    setModalShow(true);
    const userData = {
      username: username.value.trim(),
      email: email.value.trim(),
      password: newPassword.value
    }

    API.register(userData)
      .then(res => {

        // Auto log in:
        if (res.data.token) {
          document.cookie = `user=${res.data.token}; SameSite=Strict`;
          setUserState({ authenticated: true, ...res.data.userData });
          setModalText(`Thank you for registering, ${username.value}. Your account has been created successfully.`);
          return;
        }

        if (res.data === 'ACCOUNT_CREATED') {
          setModalText(`Thank you for registering, ${username.value}. Your account has been created successfully.`);
        } else {
          delete userData.password;
          setModalText(handleServerResponse(res.data, userData));
        }
      })
      .catch(err => {
        setModalText(`Uhoh. It looks like something went wrong. Please try registering again later.`);
      });
  }

  return (
    <Container>
      <h2>Register for a new account:</h2>
      <hr />
      <Form id="register-form" onSubmit={handleSubmit}>

        <FormGroup
          id="username"
          label="Username:"
          obj={
            username
          }
        />

        <FormGroup id="email" label="Email Address:" obj={email} />

        <FormGroup id="password" label="Password:" obj={newPassword} />

        <FormGroup id="confirm-password" label="Confirm Your Password" obj={confirmPassword} />

        <Button type="submit" variant="primary">Register</Button><br />
        <small className={completeForm ? 'text-danger hidden' : 'text-danger'}>
          Please fill out the form completely before registering.
        </small>
      </Form>

      <Modal
        centered
        onHide={closeModal}
        show={modalShow}
        size="lg"
      >
        <Modal.Body>
          <p>{modalText}</p>
          {userState.authenticated
          ? (
            <Button variant="success" onClick={() => props.history.push('/profile')}>
              View My Profile
            </Button>
          ) : (
            <Button variant="primary" onClick={closeModal}>OK</Button>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Register;