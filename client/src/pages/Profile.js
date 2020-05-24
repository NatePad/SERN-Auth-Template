import React, { useContext, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import UserContext from '../utils/UserContext';

const Profile = props => {
  const {userState} = useContext(UserContext);
  const [readOnly, setReadOnly] = useState(true);
  const [username, setUsername] = useState(userState.username);
  const [email, setEmail] = useState(userState.email);

  return (
    <Container>
      <h2>Your Profile Information:</h2>
      <hr />
      <Form id="profile-form">

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
        <Button variant="primary" onClick={() => setReadOnly(!readOnly)}>Edit Profile</Button>
      </Form>
    </Container>
  );
}

export default Profile;