import React, { Component } from 'react';
import { Form, Row, Button } from 'react-bootstrap';
import { TwitterPicker } from 'react-color';

import { RiDeleteBinFill } from 'react-icons/ri';
/* eslint-disable react/jsx-closing-tag-location */

export default class NodeAttributes extends Component {
  constructor(props) {
    super(props);

    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    // this.handleAttributeDeletion = this.handleAttributeDeletion.bind(this);
  }

  handleAttributeChange(e) {
    const key = e.target.parentElement.getAttribute('attribute');
    const value = e.target.value;
    this.props.updateValues(key, value);
  }

  handleAttributeDeletion(id) {
    this.props.updateValues(id, null);
  }

  render() {
    const attributeNames = Object.keys(this.props.attributes);

    return (
      <Form>
        {attributeNames.map(k => ( // Having the key include the props.attribute.id means that changing ID value is not fluid
          <Form.Group style={{ fontSize: '0.7rem', alignItems: 'flex-end' }} key={`${k}_${this.props.keyId}`} as={Row} controlId='formPlaintextPassword' attribute={k}>
            <Form.Label style={{ margin: 0, fontWeight: 600 }}>
              {k}
            </Form.Label>
            {this.props.editMode
              ? <Button style={{ marginLeft: 'auto', marginTop: '-10px' }} size='sm' bsPrefix='close' variant='danger' id={`${k}_delete`} onClick={() => this.handleAttributeDeletion(k)}>
                <RiDeleteBinFill color='red' size={12} />
              </Button> : null}
            {this.props.editMode && (k === 'fill' || k === 'stroke' || k === 'fontColour')
              ? <div style={{ zoom: 0.63 }}><TwitterPicker width='auto' triangle='hide' color={this.props.attributes[k]} onChange={(col) => this.props.updateValues(k, col.hex)} /> </div>
              : <Form.Control style={{ fontSize: '0.7rem' }} size='sm' onChange={this.handleAttributeChange} readOnly={!this.props.editMode} defaultValue={this.props.attributes[k]} />}
          </Form.Group>
        ))}
      </Form>
    );
  }
}
