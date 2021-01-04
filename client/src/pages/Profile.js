import { Container } from 'react-bootstrap';

import { useStoreContext } from '../utils/GlobalState';

const Profile = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  return (
    <Container>
      <h1>Profile Page</h1>

      <h3>Username:</h3>
      <p>{state.user.username}</p>

      <h3>Email:</h3>
      <p>{state.user.email}</p>
    </Container>
  )
}

export default Profile;
