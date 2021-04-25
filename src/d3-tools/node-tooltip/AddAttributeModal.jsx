import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

// This is reusaed in AddNodeModal, remove the duplication
const formStyles = {
  header: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem'

  },
  title: {
    fontSize: '1.4rem'

  },
  control: {
    fontSize: '0.7rem'
  },
  footer: {
    padding: '0.25rem'
  },
  button: {
    fontSize: '0.7rem'
  }
};

export default class AddAtributeModal extends Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.state = {
      attrName: '',
      attrVal: ''
    };
  }

  handleAttributeNameChange(e) {
    this.setState({ attrName: e.target.value });
  }

  handleAttributeValueChange(e) {
    this.setState({ attrVal: e.target.value });
  }

  handleSaveButtonClick() {
    if (this.state.attrName !== '' && this.state.attrVal !== '') {
      this.props.addAttribute(this.state.attrName, this.state.attrVal);
    }
    this.props.handleClose();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSaveButtonClick();
    }
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.handleClose}
        centered
        size='sm'
      >
        <Modal.Header style={formStyles.header} closeButton>
          <Modal.Title style={formStyles.title}>Add Attribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Control onKeyPress={this.handleKeyPress} onChange={(e) => this.handleAttributeNameChange(e)} style={formStyles.control} placeholder='Attribute Name' />
              </Col>
              <Col>
                <Form.Control onKeyPress={this.handleKeyPress} onChange={(e) => this.handleAttributeValueChange(e)} style={formStyles.control} placeholder='Attribute Value' />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={formStyles.footer}>
          <Button style={formStyles.button} variant='secondary' onClick={this.props.handleClose}>
            Close
          </Button>
          <Button style={formStyles.button} variant='info' onClick={() => this.handleSaveButtonClick()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
