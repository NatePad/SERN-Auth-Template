import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';

const FormGroup = props => {
  const readOnly = props.readOnly || false;
  const [textColor, setTextColor] = useState('hidden');
  
  useEffect(() => {
    setTextColor('hidden');
    if (props.match || !props.obj.value) return;

    if (props.obj.available) {
      setTextColor('text-success');
    } else if (!props.obj.valid
        || (props.obj.available !== undefined && !props.obj.available)) {
          setTextColor('text-danger');
        }
  }, [
    props.obj.invalMsg,
    props.obj.valid,
    props.obj.available
  ]);
  
  return (
    <Form.Group controlId={props.id}>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        name={props.id}
        plaintext={readOnly}
        readOnly={readOnly}
        { ...props.obj.formInput }
      />
        <Form.Text className={textColor}>
          {props.obj.invalMsg}
        </Form.Text>
    </Form.Group>
  )
}

export default FormGroup;