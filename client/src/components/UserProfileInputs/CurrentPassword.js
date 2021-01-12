import { Button, Form } from 'react-bootstrap';

import { useStoreContext } from '../../utils/GlobalState';

import API from '../../utils/API';


// REQUIRED PROPS: valid, setValid
const CurrentPassword = props => {
  const [state] = useStoreContext();

  const sendPasswordEmail = async () => {
    const email = state.user.email
      || document.querySelector('#email').value.trim();

    await API.sendPasswordEmail({
      email
    });

    alert("If an account is found for the entered email, " +
      "we'll send an email with password reset instructions.");
  }


  return (
    <Form.Group controlId="current-password">
      <Form.Label>Password:</Form.Label>
      <Form.Control
        type="password"
        placeholder="P@ssw0rd!"
        onChange={() => props.setValid(true)}
      />
      <Form.Text className={props.valid ? 'invisible' : 'text-danger'}>
        Forgot your password?
        <Button variant="link" size="sm" onClick={sendPasswordEmail}>
          Click here!
        </Button>
      </Form.Text>
    </Form.Group>
  )
}

export default CurrentPassword;
