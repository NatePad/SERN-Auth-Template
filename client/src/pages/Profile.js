import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import {
  validateUsername, invalUsernameMsg,
  validateEmail, invalEmailMsg,
  validatePassword, invalPasswordMsg
} from '../utils/InputValidator';

import API from '../utils/API';
import UserContext from '../utils/UserContext';

const Profile = props => {
  const { userState, setUserState } = useContext(UserContext);

  const [changingPassword, setChangingPassword] =  useState(false);
  const [completeForm, setCompleteForm] = useState(true);
  const [completePasswordForm, setCompletePasswordForm] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [email, setEmail] = useState(userState.email);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [responseMsg, setResponseMsg] = useState('Loading...');
  const [showResponse, setShowResponse] = useState(false);
  const [username, setUsername] = useState(userState.username);
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validUsername, setValidUsername] = useState(true);

  const password = createRef();

  useEffect(() => {
    if (username === userState.username && email === userState.email) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  }, [username, email, userState.username, userState.email]);

  useEffect(() => {
    setCompleteForm(true);
    setValidUsername(validateUsername(username));
  }, [username]);

  useEffect(() => {
    setCompleteForm(true);
    setValidEmail(validateEmail(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(validatePassword(newPassword));
  }, [newPassword]);

  useEffect(() => {
    setCompletePasswordForm(true);
    setValidConfirmPassword(newPassword === confirmPassword
      || confirmPassword.length < 1);
  }, [newPassword, confirmPassword]);

  const resetForm = () => {
    setUsername(userState.username);
    setEmail(userState.email);
    setReadOnly(true);
  }

  const clearResponse = () => {
    setModalShow(false);
    setShowResponse(false);
  }

  const changePassword = () => {
    setChangingPassword(true);
    setModalShow(true);
  }

  const closeModal = () => {
    setModalShow(false);
    setChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
  }

  // ***************************
  // * FORM SUBMISSION METHODS *
  // ***************************

  const submitPassword = e => {
    e.preventDefault();

    if (password.current.value.length < 7) {
      setIncorrectPassword(true);
      return
    }

    changingPassword ? updatePassword() : updateProfile();
  }

  const submitProfile = e => {
    e.preventDefault();

    if (!validUsername || !validEmail) {
      setCompleteForm(false);
      return;
    }

    setModalShow(true);
  }

  // ************************************
  // * METHOD TO HANDLE SERVER RESPONSE *
  // ************************************
  const handleResponse = res => {
    // Possible responses:
    // SUCCESS
    // BAD_REQUEST
    // DUPLICATE_EMAIL
    // DUPLICATE_USERNAME
    // INCORRECT_PASSWORD
    // JWT_ERROR
    // SERVER_ERROR

    if (res.data === 'INCORRECT_PASSWORD') {
      setIncorrectPassword(true);
      return;
    }

    setShowResponse(true);

    switch (res.data) {
      case 'SUCCESS':
        if (!changingPassword) {
          setUserState({
            ...userState,
            username,
            email
          });
          setReadOnly(true);
        } else {
          setChangingPassword(false);
        }
        setResponseMsg(`Your changes have been saved successfully.`);
        break;
      case 'BAD_REQUEST':
        setResponseMsg(`Some of your new information is invalid. Please try updating your profile again.`);
        break;
      case 'DUPLICATE_EMAIL':
        setResponseMsg(`The email address ${email} has already been used for another account.`);
        break;
      case 'DUPLICATE_USERNAME':
        setResponseMsg(`The username ${username} is already taken.`);
        break;
      case 'JWT_ERROR':
        console.log(`It looks like the JWT_SECRET changed.`);
        break;
      case 'SERVER_ERROR':
        setResponseMsg(`Uhoh. It looks like something went wrong on the server. Please try registering again later.`);
        break;
      default:
        setResponseMsg(`The server has sent an unexpected response. This is awkward.`);
    }
  }

  // ******************
  // * UPDATE METHODS *
  // ******************
  const updatePassword = () => {
    if (!validPassword || !validConfirmPassword) {
      setCompletePasswordForm(false);
      return;
    }

    const userData = {
      password: password.current.value,
      newPassword
    }

    API.updateUserPassword(userData)
    .then(res => {
      handleResponse(res);
    })
    .catch(err => {
      console.log('Uh oh! Something went wrong.');
    });
  }

  const updateProfile = () => {

    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password.current.value
    }

    API.updateUserProfile(userData)
      .then(res => {
        handleResponse(res);
      })
      .catch(err => {
        console.log('Uh oh! Something went wrong.');
      });
  }

  return (
    <Container>
      <h2>Your Profile Information:</h2>
      <hr />
      <Form id="profile-form" onSubmit={submitProfile}>

        {/*
        ******************
        * USERNAME FIELD *
        ******************
        */}
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            name="username"
            onChange={e => setUsername(e.target.value)}
            plaintext={readOnly}
            readOnly={readOnly}
            type="text"
            value={username}
          />
          <Form.Text className={validUsername ? 'text-danger hidden' : 'text-danger'}>
            {invalUsernameMsg}
          </Form.Text>
        </Form.Group>

        {/*
        ***************
        * EMAIL FIELD *
        ***************
        */}
        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            name="email"
            onChange={e => setEmail(e.target.value)}
            plaintext={readOnly}
            readOnly={readOnly}
            type="email"
            value={email}
          />
          <Form.Text className={validEmail ? 'text-danger hidden' : 'text-danger'}>
            {invalEmailMsg}
          </Form.Text>
        </Form.Group>

        {/*
        ****************
        * FORM BUTTONS *
        ****************
        */}
        {readOnly ? (
          <div>
            <Button variant="primary" onClick={() => setReadOnly(false)}>Edit Profile</Button>
          </div>
        ) : (
          <div>
            <Button
              variant="success"
              type="submit"
              className="mr-3"
              disabled={disabledSubmit}
            >
              Submit Changes
            </Button>
            <Button variant="danger" onClick={resetForm}>Cancel Changes</Button>
          </div>
        )}
        <small className={completeForm ? 'text-danger hidden' : 'text-danger'}>
          Please fill out the form completely before submitting your changes.
        </small>
      </Form>

      <Button variant="warning" className="mt-1" onClick={changePassword}>Change Your Password</Button>

      {/*
      ******************
      * PASSWORD MODAL *
      ******************
      */}
      <Modal onHide={closeModal} show={modalShow} size="lg" centered>
        <Modal.Body>
          {showResponse ? (
            <div>
              <p>{responseMsg}</p>
              <Button variant="primary" onClick={clearResponse}>OK</Button>
            </div>
          ) : (
            <Form id="password-form" onSubmit={submitPassword}>

              {/*
              **************************
              * CURRENT PASSWORD FIELD *
              **************************
              */}
              <Form.Group controlId="password">
                <Form.Label>Enter Password:</Form.Label>
                <Form.Control
                  name="password"
                  onChange={() => setIncorrectPassword(false)}
                  placeholder="Enter Password"
                  ref={password}
                  type="password"
                />
                <small className={incorrectPassword ? 'text-danger' : 'text-danger hidden'}>
                  Incorrect password.
                </small>
              </Form.Group>

              {changingPassword ? (
                <div>
                  <hr />

                  {/*
                  **********************
                  * NEW PASSWORD FIELD *
                  **********************
                  */}
                  <Form.Group controlId="newPassword">
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control
                      name="newPassword"
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="P@55w0rd!"
                      type="password"
                    />
                    <small className={validPassword ? 'text-danger hidden' : 'text-danger'}>
                      {invalPasswordMsg}
                    </small>
                  </Form.Group>

                  {/*
                  **************************
                  * CONFIRM PASSWORD FIELD *
                  **************************
                  */}
                  <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm New Password:</Form.Label>
                    <Form.Control
                      name="confirmPassword"
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Enter Password Again"
                      type="password"
                    />
                    <small className={validConfirmPassword ? 'text-danger hidden' : 'text-danger'}>
                      Your passwords do not match.
                    </small>
                  </Form.Group>
                </div>
              ) : (null)}

              <Button variant="primary" type="submit" className="mr-3">Submit</Button>
              <Button variant="warning" onClick={closeModal}>Close</Button><br />
              <small className={completePasswordForm ? 'text-danger hidden' : 'text-danger'}>
                Please fix all errors on the form before submitting.
              </small>
            </Form>
          )}
          
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Profile;