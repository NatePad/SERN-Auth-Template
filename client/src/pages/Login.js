import React, { createRef, useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Modal
} from 'react-bootstrap';
import API from '../utils/API';
import UserContext from '../utils/UserContext';
import handleServerResponse from '../utils/handleServerResponse';

const Login = props => {
  const { setUserState } = useContext(UserContext);
  
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [redirect, setRedirect] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('Loading...');
  const email = createRef();
  const password = createRef();

  useEffect(() => {
    // This shows a warning in the console which can be ignored
    // as the necessary props won't change while this page is loaded.
    if (props.location.state)
      setRedirect(props.location.state.from.pathname);
  }, []);

  const sendPasswordEmail = () => {
    setModalShow(true);

    if (!validEmail) {
      setModalText('Please enter a registered email address.');
      return;
    }

    const urlArr = window.location.href.split('/');
    const urlPrefix = urlArr[0] + '//' + urlArr[2];

    const userData = {
      email: email.current.value.trim(),
      urlPrefix
    };

    API.sendPasswordEmail(userData)
    .then(res => {
      switch (res.data) {
        case 'EMAIL_SENT':
          setModalText(`An email has been sent to ${userData.email}. Please check your
              email for instructions on how to reset your password.`);
          break;
        case 'INVALID_EMAIL':
          setModalText('Please enter a registered email address.');
          break;
        default:
          setModalText(handleServerResponse({ response: res.data }));
      }

    })
    .catch(err => {
      console.log('Uhoh! Something went wrong.');
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const userData = {
      email: email.current.value.trim(),
      password: password.current.value
    }

    API.login(userData)
      .then(res => {

        if (res.data.token) {
          document.cookie = `user=${res.data.token}; SameSite=Strict`;
          setUserState({ authenticated: true, ...res.data.userData });
          props.history.push('/profile');
          return;
        }

        switch (res.data) {
          case 'INVALID_EMAIL':
            setValidEmail(false);
            break;
          case 'INCORRECT_PASSWORD':
            setValidPassword(false);
            break;
          default:
            console.log(handleServerResponse({ response: res.data }));
        }
      })
      .catch(err => {
        console.log('Uh oh! Something went wrong.');
      });
  }

  return (
    <Container>
      {redirect
        ? <h2>You must sign in to view the {redirect.substring(1)} page:</h2>
        : <h2>Sign In:</h2>
      }
      <hr />
      <Form id="login-form" onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            name="email"
            onChange={() => setValidEmail(true)}
            placeholder="your@email.com"
            ref={email}
            type="email"
          />
          <Form.Text className={validEmail ? 'text-danger hidden' : 'text-danger'}>
            Our lemmings can't find that email address in our system.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            name="password"
            onChange={() => setValidPassword(true)}
            placeholder="Enter Password"
            ref={password}
            type="password"
          />
          <Form.Text className={validPassword ? 'text-danger hidden' : 'text-danger'}>
            Incorrect password. <span className="link-style" onClick={sendPasswordEmail}>Click here</span> to reset your password.
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary">Sign In</Button><br />
      </Form>

      <Modal
        centered
        show={modalShow}
        size="lg"
      >
        <Modal.Body>
          <p>{modalText}</p>
          <Button variant="primary" onClick={() => setModalShow(false)}>OK</Button>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Login;
