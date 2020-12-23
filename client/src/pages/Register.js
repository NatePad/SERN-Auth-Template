import { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Form,
  Modal
} from 'react-bootstrap';

import API from '../utils/API';
import useDebounce from '../utils/debounceHook';

const Register = () => {

  // GENERAL VARIABLES
  const TEXT_GREEN = 'text-success';
  const TEXT_RED = 'text-danger';

  const [completeForm, setCompleteForm] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('');


  // USERNAME VARIABLES
  const USERNAME_MAX_LEN = 35;
  const USERNAME_MIN_LEN = 6;
  const USERNAME_INVAL_MSG = `Usernames can be ${USERNAME_MIN_LEN} to ${USERNAME_MAX_LEN} characters long and can contain letters (a-z), numbers (0-9), and periods (.).`;
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


  // PASSWORD VARIABLES
  const PASSWORD_MAX_LEN = 128;
  const PASSWORD_MIN_LEN = 8;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);


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
  }, [debouncedTerm])


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


  // PASSWORD SECTION
  useEffect(() => {
    setCompleteForm(true);

    let valid = PASSWORD_REGEX.test(password);

    if (password.length < PASSWORD_MIN_LEN
      || password.length > PASSWORD_MAX_LEN) valid = false;

    setPasswordValid(valid);
    setConfirmPasswordValid(password === confirmPassword);
    // eslint-disable-next-line
  }, [password]);


  useEffect(() => {
    setConfirmPasswordValid(password === confirmPassword);
    // eslint-disable-next-line
  }, [confirmPassword]);


  // FORM SUBMISSION HANDLER
  const handleSubmit = async e => {
    e.preventDefault();

    if (!usernameValid
      || !emailValid
      || !passwordValid
      || !confirmPasswordValid) {
      setCompleteForm(false);
      return;
    }

    const userData = {
      username,
      email,
      password
    }

    try {
      const res = await API.register(userData);

      res.status === 201
        ? setModalText(`Your account has been created successfully, ${res.data.username}!`)
        : setModalText('Either the provided username or email address is already being used.')

      setModalShow(true);
    } catch (err) {
      setModalText('There was an error creating your account. Please try again later.');
      setModalShow(true);
    }
  }


  return (
    <Container>

      <h1 className="mb-3">Register for an Account:</h1>

      <Form onSubmit={handleSubmit}>


        {/* USERNAME */}
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="username"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
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
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Text className={emailValid ? `${TEXT_RED} invisible` : TEXT_RED}>
            Please enter a valid email address.
          </Form.Text>
        </Form.Group>


        {/* PASSWORD */}
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="P@ssw0rd!"
            onChange={e => setPassword(e.target.value)}
          />
          <Form.Text className={passwordValid ? `${TEXT_RED} invisible` : TEXT_RED}>
            Passwords need to be at least 8 characters and contain both a lower
            and uppercase letter, a number, and a special character.
          </Form.Text>
        </Form.Group>


        {/* CONFIRM PASSWORD */}
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Your Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="P@ssw0rd!"
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <Form.Text className={confirmPasswordValid ? `${TEXT_RED} invisible` : TEXT_RED}>
            Your passwords do not match.
          </Form.Text>
        </Form.Group>


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
