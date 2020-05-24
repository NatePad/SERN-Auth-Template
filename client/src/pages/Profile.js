import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import UserContext from '../utils/UserContext';

const Profile = props => {
  const {userState} = useContext(UserContext)
  return (
    <Container>
      <h2>Your Profile Information:</h2>
      <hr />
      <ul>
        <li><strong>Username:</strong> {userState.username}</li>
        <li><strong>Email Address:</strong> {userState.email}</li>
      </ul>
    </Container>
  );
}

export default Profile;