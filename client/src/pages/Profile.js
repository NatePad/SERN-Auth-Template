import { useState } from 'react';

import { Button, Container, Form } from 'react-bootstrap';

import { useStoreContext } from '../utils/GlobalState';

import Username from '../components/UserProfileInputs/Username';
import Email from '../components/UserProfileInputs/Email';

const Profile = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();
  const [readOnly, setReadOnly] = useState(true);

  const handleSubmit = e => {
    e.preventDefault();

    console.log('submitting');
  }

  return (
    <Container>
      <h1>Your Profile:</h1>

      <Form className="mb-4" onSubmit={handleSubmit}>
        <Username readOnly={readOnly} />
        <Email />

        {readOnly
          ? <Button variant="primary" id="edit" onClick={() => setReadOnly(!readOnly)}>Edit My Information</Button>
          : (
            <>
              <Button variant="success" type="submit" id="submit">Submit</Button>
              <Button className="ml-5" variant="danger" onClick={() => setReadOnly(!readOnly)}>Cancel</Button>
            </>
          )}
      </Form>

      <Button variant="warning" disabled>Change my Password</Button>
    </Container>
  )
}

export default Profile;
