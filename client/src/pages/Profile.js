import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';

import API from '../utils/API';
import UserContext from '../utils/UserContext';
import useProfileModel from '../utils/useProfileModel';
import FormGroup from '../components/FormGroup';

const Profile = props => {
  const { userState, setUserState } = useContext(UserContext);
  const { username, email, newPassword, confirmPassword } = useProfileModel();

  const [changingPassword, setChangingPassword] =  useState(false);
  const [completeForm, setCompleteForm] = useState(true);
  const [completePasswordForm, setCompletePasswordForm] = useState(true);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [responseMsg, setResponseMsg] = useState('Loading...');
  const [showResponse, setShowResponse] = useState(false);

  const password = createRef();

  useEffect(() => {
    username.setValue(userState.username);
    email.setValue(userState.email);
  }, []);

  useEffect(() => {
    if (username.value === userState.username && email.value === userState.email) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  }, [username.value, email.value, userState.username, userState.email]);

  useEffect(() => {
    setCompleteForm(true);
  }, [username.value, email.value]);

  useEffect(() => {
    setCompletePasswordForm(true);
  }, [newPassword.value, confirmPassword.value]);

  const resetForm = () => {
    username.setValue(userState.username);
    email.setValue(userState.email);
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
    newPassword.reset();
    confirmPassword.reset();
  }

  // ***************************
  // * FORM SUBMISSION METHODS *
  // ***************************

  const submitPassword = e => {
    e.preventDefault();

    if (password.current.value.length < 7) {
      setIncorrectPassword(true);
      return;
    }

    changingPassword ? updatePassword() : updateProfile();
  }

  const submitProfile = e => {
    e.preventDefault();

    if (!username.valid || !email.valid) {
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
        setResponseMsg(`The email address ${email.value} has already been used for another account.`);
        break;
      case 'DUPLICATE_USERNAME':
        setResponseMsg(`The username ${username.value} is already taken.`);
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
    if (!newPassword.valid || !confirmPassword.valid) {
      setCompletePasswordForm(false);
      return;
    }

    const userData = {
      password: password.current.value,
      newPassword: newPassword.value
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
      username: username.value.trim(),
      email: email.value.trim(),
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
        <FormGroup id="username" label="Username:" obj={username} readOnly={readOnly} />

        {/*
        ***************
        * EMAIL FIELD *
        ***************
        */}
        <FormGroup id="email" label="Email:" obj={email} readOnly={readOnly} />


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
                  <FormGroup id="newPassword" label="New Password:" obj={newPassword} />


                  {/*
                  **************************
                  * CONFIRM PASSWORD FIELD *
                  **************************
                  */}
                  <FormGroup id="confirmPassword" label="Confirm New Password:" obj={confirmPassword} />

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