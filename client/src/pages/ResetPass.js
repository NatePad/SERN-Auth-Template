import React, { useEffect, useState } from 'react';
import { validatePassword, invalPasswordMsg } from '../utils/InputValidator';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import API from '../utils/API';

const ResetPass = props => {
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [successfulReset, setSuccessfulReset] = useState(false);
  const [completeForm, setCompleteForm] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('Loading...');

  useEffect(() => {
    setCompleteForm(true);
    setValidPassword(validatePassword(password));
  }, [password]);

  useEffect(() => {
    setCompleteForm(true);
    setValidConfirmPassword(password === confirmPassword
        || confirmPassword.length < 1);
  }, [password, confirmPassword]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!validPassword || !validConfirmPassword) {
      setCompleteForm(false);
      return;
    }

    const userData = {
      id: props.match.params.id,
      resetCode: props.match.params.resetCode,
      password
    }

    API.resetPass(userData)
      .then(res => {
        // Possible responses:
        // SUCCESS
        // INVALID_ID
        // INVALID_CODE
        // INVALID_PASS
        // SERVER_ERROR
        if (res.data === 'INVALID_PASS') {
          setValidPassword(false);
          return;
        }

        switch (res.data) {
          case 'SUCCESS':
            setModalText(`Your password has been reset successfully.
                Click the button below to visit the sign in page.`);
            setSuccessfulReset(true);
            break;
          case 'INVALID_ID':
          case 'INVALID_CODE':
            setModalText(`It looks like there is an issue with the link from
                your email. Please make sure you copied the link without
                any spaces or extra charaters.`);
            break;
          case 'SERVER_ERROR':
            setModalText(`Uhoh. It looks like something went wrong on the server. Please try registering again later.`);
            break;
          default:
            setModalText(`The server has sent an unexpected response. This is awkward.`);
        }

        setModalShow(true);
      })
      .catch(err => {
        console.log('Uh oh. It looks like something went wrong.');
      });
  }

  return (
    <Container>
      <Form id="new-password" onSubmit={handleSubmit}>
        <Form.Group controlId="newPassword">
          <Form.Label>New Password:</Form.Label>
          <Form.Control
            name="newPassword"
            onChange={e => setPassword(e.target.value)}
            placeholder="P@55w0rd!"
            type="password"
          />
          <small className={validPassword ? 'text-danger hidden' : 'text-danger'}>
            {invalPasswordMsg}
          </small>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm New Password:</Form.Label>
          <Form.Control
            name="confirmPassword"
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Enter Password Again"
            type="password"
          />
          <small className={validConfirmPassword ? 'text-danger hidden' : 'text-danger'}>
            Your passwords do not match.
          </small>
        </Form.Group>
        <Button variant="primary" type="submit">Set New Password</Button><br />
        <small className={completeForm ? 'text-danger hidden' : 'text-danger'}>
          Please fill out the form completely before submitting.
        </small>
      </Form>

      <Modal
        centered
        show={modalShow}
        size="lg"
      >
        <Modal.Body>
          <p>{modalText}</p>
          {!successfulReset
            ? <Button variant="primary" onClick={() => setModalShow(false)}>OK</Button>
            : <Button variant="primary" onClick={() => props.history.push('/login')}>Sign In</Button>
          }
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default ResetPass;