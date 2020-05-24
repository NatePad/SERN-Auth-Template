import React, { createRef, useContext, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import UserContext from '../utils/UserContext';

const Profile = props => {
  const {userState} = useContext(UserContext);
  const [readOnly, setReadOnly] = useState(true);
  const [username, setUsername] = useState(userState.username);
  const [email, setEmail] = useState(userState.email);
  const [modalShow, setModalShow] = useState(false);
  const password = createRef();

  const resetForm = () => {
    setUsername(userState.username);
    setEmail(userState.email);
    setReadOnly(true);
  }

  const submitProfile = e => {
    e.preventDefault();
    if (username === userState.username && email === userState.email) return;
    setModalShow(true);
  }

  const submitPassword = e => {
    e.preventDefault();
    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password.current.value
    }

    console.log(userData);
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
        </Form.Group>

        {readOnly ? (
          <Button variant="primary" onClick={() => setReadOnly(false)}>Edit Profile</Button>
        ) : (
          <div>
            <Button variant="success" type="submit" className="mr-3">Submit Changes</Button>
            <Button variant="danger" onClick={resetForm}>Cancel Changes</Button>
          </div>
        )}
      </Form>

      <Modal show={modalShow} size="lg" centered>
        <Modal.Body>
          <Form id="password-form" onSubmit={submitPassword}>

            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                name="password"
                placeholder="Enter Password"
                ref={password}
                type="password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mr-3">Submit</Button>
            <Button variant="warning" onClick={() => setModalShow(false)}>Close</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Profile;