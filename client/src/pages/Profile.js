import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';

import API from '../utils/API';
import handleResponse from '../utils/handleResponse';
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
  const handleServerResponse = res => {
    if (res.data === 'INCORRECT_PASSWORD') {
      setIncorrectPassword(true);
      return;
    }

    setShowResponse(true);

    if (res.data === 'SUCCESS') {
      if (!changingPassword) {
        setUserState({
          ...userState,
          username: username.value,
          email: email.value
        });
        setReadOnly(true);
      } else {
        setChangingPassword(false);
      }
      setResponseMsg(`Your changes have been saved successfully.`);
    } else {
      setResponseMsg(handleResponse(res.data, username.value, email.value));
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
      handleServerResponse(res);
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
        handleServerResponse(res);
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

        <FormGroup id="username" label="Username:" obj={username} readOnly={readOnly} />

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
              <FormGroup id="password" label="Enter Password:"
                obj={{
                  valid: !incorrectPassword,
                  invalMsg: 'Incorrect password.',
                  formInput: {
                    onChange: () => setIncorrectPassword(false),
                    placeholder: "Enter Password",
                    type: 'password',
                    ref: password
                  }
                }}
              />

              {changingPassword ? (
                <div>
                  <hr />

                  <FormGroup id="newPassword" label="New Password:" obj={newPassword} />

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