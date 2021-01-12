import { Form } from 'react-bootstrap';
import { useStoreContext } from '../../../utils/GlobalState';

import './style.css';
import API from '../../../utils/API';

// REQUIRED PROPS: correct, setCorrect
const CurrentPassword = props => {
  const [state] = useStoreContext();

  const sendPasswordEmail = async () => {
    const email = state.user.email ||
      document.querySelector('#email').value.trim();

    await API.sendPasswordEmail({ email });

    alert("If an account is found for the entered email, " +
      "we'll send an email with password reset instructions.");
  };

  return (
    <Form.Group controlId="current-password">
      <Form.Label>Password:</Form.Label>
      <Form.Control
        type="password"
        placeholder="P@ssw0rd!"
        onChange={() => props.setCorrect(true)}
      />
      <Form.Text className={props.correct ? 'invisible' : 'text-danger'}>
        Incorrect password.&nbsp;
        <span className="link-style" onClick={sendPasswordEmail}>
          Click here
        </span> to reset your password.
      </Form.Text>
    </Form.Group>
  );
};

export default CurrentPassword;
