import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

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

export default class AddNodeModal extends Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.state = {
      nodeId: '',
      nodeName: ''
    };
  }

  handleNodeIDChange(e) {
    this.setState({ nodeId: e.target.value });
  }

  handleNodeNameChange(e) {
    this.setState({ nodeName: e.target.value });
  }

  // Add logic to check if ID already exists
  handleSaveButtonClick() {
    // if (this.state.nodeId !== '') {
    if (this.state.nodeId !== '' && this.state.nodeName !== '') {
      this.props.addNewNode(this.state.nodeId, this.state.nodeName, this.props.xPos, this.props.yPos);
      // this.props.addNewNode(this.state.nodeId, this.props.xPos, this.props.yPos);
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
          <Modal.Title style={formStyles.title}>Add New Node</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Control onKeyPress={this.handleKeyPress} onChange={(e) => this.handleNodeIDChange(e)} style={formStyles.control} placeholder='Unique Node ID' />
              </Col>
              <Col>
                <Form.Control onKeyPress={this.handleKeyPress} onChange={(e) => this.handleNodeNameChange(e)} style={formStyles.control} placeholder='Node Name' />
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
