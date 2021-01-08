import { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Form,
  Modal
} from 'react-bootstrap';

import API from '../utils/API';
import NewPassword from '../components/UserProfileInputs/NewPassword';
import useDebounce from '../utils/debounceHook';

const Register = () => {
  const [validPassword, setValidPassword] = useState(false);

  // GENERAL VARIABLES
  const TEXT_GREEN = 'text-success';
  const TEXT_RED = 'text-danger';

  const [completeForm, setCompleteForm] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('');


  // USERNAME VARIABLES
  const USERNAME_MAX_LEN = 35;
  const USERNAME_MIN_LEN = 6;
  const USERNAME_INVAL_MSG =
    `Usernames can be ${USERNAME_MIN_LEN} to ${USERNAME_MAX_LEN} characters ` +
    `long and can contain letters (a-z), numbers (0-9), and periods (.).`;
  const USERNAME_VALID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz.';

  const [username, setUsername] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState(USERNAME_INVAL_MSG);
  const [usernameMsgColor, setUsernameMsgColor] = useState(TEXT_RED);


  // EMAIL VARIABLES
  const EMAIL_MAX_LEN = 350;
  const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);


  // DEBOUNCER
  const debouncedTerm = useDebounce(username, 500);

  useEffect(() => {
    const checkUsername = async () => {
      const results = await API.findByUsername(username);
      if (results.data) {
        setUsernameMsgColor(TEXT_RED);
        setUsernameMsg(`The username ${username} is taken.`);
      } else {
        setUsernameMsgColor(TEXT_GREEN);
        setUsernameMsg(`The username ${username} is available.`);
      }
    }

    if (usernameValid) {
      checkUsername();
    }

    // eslint-disable-next-line
  }, [debouncedTerm]);


  // USERNAME SECTION
  useEffect(() => {
    setCompleteForm(true);
    let valid = true;
    if (username.length < USERNAME_MIN_LEN
      || username.length > USERNAME_MAX_LEN)
      valid = false;

    const lowerName = username.toLowerCase();
    for (let i = 0; i < lowerName.length; i++) {
      if (!USERNAME_VALID_CHARS.includes(lowerName.charAt(i))) valid = false;
    }

    setUsernameValid(valid);
  }, [username]);


  useEffect(() => {
    if (!usernameValid) {
      setUsernameMsg(USERNAME_INVAL_MSG);
      setUsernameMsgColor(TEXT_RED);
    }
    // eslint-disable-next-line
  }, [usernameValid]);


  // EMAIL SECTION
  useEffect(() => {
    setCompleteForm(true);

    let valid = EMAIL_REGEX.test(email);
    if (email.length > EMAIL_MAX_LEN) valid = false;

    setEmailValid(valid);
    // eslint-disable-next-line
  }, [email]);


  // FORM SUBMISSION HANDLER
  const handleSubmit = async e => {
    e.preventDefault();

    if (!usernameValid
      || !emailValid
      || !validPassword) {
      setCompleteForm(false);
      return;
    }

    const userData = {
      username,
      email,
      password: document.querySelector('#password').value.trim()
    }

    try {
      const results = await API.register(userData);

      results.status === 201
        ? setModalText(`Your account has been created successfully, ${results.data.username}!`)
        : setModalText('Either the provided username or email address is already being used.')

      setModalShow(true);
    } catch (err) {
      setModalText('There was an error creating your account. Please try again later.');
      setModalShow(true);
    }
  }


  return (
    <Container>

      <h1>Register for an Account:</h1>

      <Form onSubmit={handleSubmit}>


        {/* USERNAME */}
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="username"
            placeholder="Username"
            onChange={e => setUsername(e.target.value.trim())}
          />
          <Form.Text className={usernameMsgColor}>
            {usernameMsg}
          </Form.Text>
        </Form.Group>


        {/* EMAIL */}
        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="email"
            placeholder="your@email.com"
            onChange={e => setEmail(e.target.value.trim())}
          />
          <Form.Text className={emailValid ? `invisible` : TEXT_RED}>
            Please enter a valid email address.
          </Form.Text>
        </Form.Group>


        <NewPassword setValid={setValidPassword} />


        {/* SUBMIT BUTTON */}
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Form.Text className={completeForm ? `${TEXT_RED} invisible` : TEXT_RED}>
          Please fix all remaining form errors.
        </Form.Text>

      </Form>


      {/* RESPONSE MODAL */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Body>

          <p>{modalText}</p>

          <Button variant="primary" onClick={() => setModalShow(false)}>
            Close
          </Button>

        </Modal.Body>
      </Modal>


    </Container>
  )
}

export default Register;
