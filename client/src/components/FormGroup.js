import React from 'react';
import { Form } from 'react-bootstrap';

const FormGroup = props => {
  const readOnly = props.readOnly || false;
  
  return (
    <Form.Group controlId={props.id}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        name={props.id}
        plaintext={readOnly}
        readOnly={readOnly}
        { ...props.obj.formInput }
      />
      <Form.Text className={props.obj.valid ? 'text-danger hidden' : 'text-danger'}>
        {props.obj.invalMsg}
      </Form.Text>
    </Form.Group>
  )
}

export default FormGroup;