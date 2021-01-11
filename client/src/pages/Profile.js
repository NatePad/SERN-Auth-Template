import { useState } from 'react';

import { Button, Container, Form } from 'react-bootstrap';

import { useStoreContext } from '../utils/GlobalState';

import Username from '../components/UserProfileInputs/Username';
import Email from '../components/UserProfileInputs/Email';

const Profile = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();
  const [readOnly, setReadOnly] = useState(true);

  const [validForm, setValidForm] = useState(true);

  const handleSubmit = e => {
    e.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();

    if (username === state.user.username && email === state.user.email) {
      alert("Your information hasn't changed.");
      return;
    }

    const newData = {
      username,
      email
    }
  }

  return (
    <Container>
      <h1>Your Profile:</h1>

      <Form className="mb-4" onSubmit={handleSubmit}>
        <Username readOnly={readOnly} />
        <Email readOnly={readOnly} />

        {readOnly
          ? <Button variant="primary" onClick={() => setReadOnly(!readOnly)}>
              Edit My Information
            </Button>
          : (
            <>
              <Button variant="success" type="submit" disabled={!validForm}>
                Submit
              </Button>
              <Button
                className="ml-5"
                variant="danger"
                onClick={() => setReadOnly(!readOnly)}
              >
                Cancel
              </Button>
              <Form.Text className={validForm ? 'invisible' : 'text-danger'}>
                Please fix all form errors before submitting.
              </Form.Text>
            </>
          )}
      </Form>

      <Button className={readOnly ? 'mt-4' : ''} variant="warning" disabled>
        Change my Password
      </Button>
    </Container>
  )
}

export default Profile;
