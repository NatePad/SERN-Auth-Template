import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import {
  validateUsername, invalUsernameMsg,
  validateEmail, invalEmailMsg
} from '../utils/InputValidator';

import API from '../utils/API';
import UserContext from '../utils/UserContext';

const Profile = props => {
  const { userState, setUserState } = useContext(UserContext);
  const [readOnly, setReadOnly] = useState(true);
  const [username, setUsername] = useState(userState.username);
  const [validUsername, setValidUsername] = useState(true);
  const [email, setEmail] = useState(userState.email);
  const [validEmail, setValidEmail] = useState(true);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [completeForm, setCompleteForm] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMsg, setResponseMsg] = useState('Loading...');
  const password = createRef();

  useEffect(() => {
    setCompleteForm(true);
    setValidUsername(validateUsername(username));
  }, [username]);

  useEffect(() => {
    setCompleteForm(true);
    setValidEmail(validateEmail(email));
  }, [email]);

  const resetForm = () => {
    setUsername(userState.username);
    setEmail(userState.email);
    setReadOnly(true);
  }

  const submitProfile = e => {
    e.preventDefault();
    if ((username === userState.username && email === userState.email)
        || !validUsername
        || !validEmail) {
          setCompleteForm(false);
          return;
        }

    setModalShow(true);
  }

  const clearResponse = () => {
    setModalShow(false);
    setShowResponse(false);
  }

  const submitPassword = e => {
    e.preventDefault();
    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password.current.value
    }

    API.updateUser(userData)
      .then(res => {
        if (res.data.username) {
          setUserState({ ...userState, ...res.data });
          setReadOnly(true);
          setModalShow(false);
          return;
        }

        // Possible responses:
        // BAD_REQUEST
        // JWT_ERROR
        // INCORRECT_PASSWORD
        if (res.data === 'INCORRECT_PASSWORD') {
          setIncorrectPassword(true);
          return;
        }

        setShowResponse(true);
        switch (res.data) {
          case 'BAD_REQUEST':
            setResponseMsg(`Some of your new information is invalid. Please try updating your profile again.`);
            break;
          case 'JWT_ERROR':
            console.log('It looks like the JWT_SECRET changed.');
            break;
          default:
            setResponseMsg(`The server has sent an unexpected response. This is awkward.`);
        }
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

        {readOnly ? (
          <Button variant="primary" onClick={() => setReadOnly(false)}>Edit Profile</Button>
        ) : (
          <div>
            <Button variant="success" type="submit" className="mr-3">Submit Changes</Button>
            <Button variant="danger" onClick={resetForm}>Cancel Changes</Button>
          </div>
        )}
        <small className={completeForm ? 'text-danger hidden' : 'text-danger'}>
          Please fill out the form completely before submitting your changes.
        </small>
      </Form>

      <Modal onHide={() => setModalShow(false)} show={modalShow} size="lg" centered>
        <Modal.Body>
          {showResponse ? (
            <div>
              <p>{responseMsg}</p>
              <Button variant="primary" onClick={clearResponse}>OK</Button>
            </div>
          ) : (
            <Form id="password-form" onSubmit={submitPassword}>

              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
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
              <Button variant="primary" type="submit" className="mr-3">Submit</Button>
              <Button variant="warning" onClick={() => setModalShow(false)}>Close</Button>
            </Form>
          )}
          
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Profile;