import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import { Button, Card, Fade, ButtonToolbar } from 'react-bootstrap';
import NodeAttributes from './NodeAttributes';
import AddAttributeModal from './AddAttributeModal';
import { cleanNodeAttributes } from '../utils';
/* eslint-disable react/jsx-closing-tag-location */

let prevClass = null;

const cardStyles = {
  card: {
    position: 'absolute',
    right: '5%',
    width: '26%',
    marginTop: '3%',
    maxHeight: '70%'
  },
  body: {
    overflowY: 'scroll',
    paddingTop: '6px',
    paddingBottom: '3px'

  },
  buttonToolbarNonEditMode: {
    justifyContent: 'flex-end'
  },
  buttonToolbarEditMode: {
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  button: {
    margin: '0.25rem'
  },
  footer: {
    paddingTop: '3px',
    paddingBottom: '3px'
  }

};

export default class NodeTooltip extends Component {
  constructor(props) {
    super(props);

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.updateAttributeValues = this.updateAttributeValues.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);

    this.state = {
      attributes: {},
      selectedNode: null,
      editMode: false,
      showModal: false
    };
  }

  // This makes it so that the state.attributes variable is set when a new prop comes,
  // and does not get overriden on every render. Added this so that adding an attribute
  // is only confirmed when the user clicks save.
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedNode !== prevState.selectedNode && nextProps.selectedNode !== null) {
      const attributes = cleanNodeAttributes(_.cloneDeep(nextProps.selectedNode.__data__));
      return {
        attributes,
        selectedNode: nextProps.selectedNode
      };
    } else return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.selectedNode && prevProps.selectedNode !== this.props.selectedNode) {
        this.toggleNodeHighlight(prevProps.selectedNode, false);
      }
      if (this.props.show) {
        prevClass = this.props.selectedNode.getAttribute('class');
        this.toggleNodeHighlight(this.props.selectedNode, true);
      } else {
        this.toggleNodeHighlight(prevProps.selectedNode, false);
      }
      if (this.state.editMode) {
        this.toggleEditMode();
      }
    }
  }

  toggleNodeHighlight(node, highlight) {
    const _class = highlight ? 'node-selected' : prevClass;
    d3.select(node).attr('class', _class);
  }

  updateAttributeValues(key, val) {
    const { attributes } = this.state;
    attributes[key] = val;
    this.setState({ attributes });
  }

  handleSaveButtonClick() {
    for (const k in this.state.attributes) {
      if (this.state.attributes[k] === null) {
        delete this.props.selectedNode.__data__[k];
      } else this.props.selectedNode.__data__[k] = this.state.attributes[k];
    }
    this.toggleEditMode();
    this.props.reRender();
  }

  handleAddButtonClick() {
    this.setState({ showModal: true });
  }

  closeTooltip() {
    this.setState({ selectedNode: null, editMode: !this.state.editMode });
    this.props.turnOff();
  }

  handleModalClose() {
    this.setState({ showModal: false });
  }

  toggleEditMode() {
    this.setState((state) => {
      return { editMode: !state.editMode };
    });
  }

  displayTooltip() {
    const filteredAttrs = Object.fromEntries(Object.entries(this.state.attributes).filter(([k, v]) => v !== null));

    return (
      <Card style={cardStyles.card}>
        <Card.Header as='h5'>
          Attributes
          <Button bsPrefix='close' onClick={this.closeTooltip}>
            <span aria-hidden='true'>×</span>
            <span className='sr-only'>Close</span>
          </Button>
        </Card.Header>
        <Card.Body style={cardStyles.body}>
          <NodeAttributes attributes={filteredAttrs} editMode={this.state.editMode} updateValues={this.updateAttributeValues} keyId={filteredAttrs.id} />
        </Card.Body>
        <Card.Footer style={cardStyles.footer}>
          {this.createTooltipButtons()}
        </Card.Footer>
      </Card>
    );
  }

  displayModal() {
    return (
      <AddAttributeModal show={this.state.showModal} handleClose={this.handleModalClose} addAttribute={this.updateAttributeValues} />
    );
  }

  createTooltipButtons() {
    return (
      <div style={{ paddingTop: '5px' }}>
        {!this.state.editMode
          ? <ButtonToolbar style={cardStyles.buttonToolbarNonEditMode}>
            <Button style={cardStyles.button} onClick={this.toggleEditMode} size='sm' variant='info'>
              Edit
            </Button>
          </ButtonToolbar>
          : <ButtonToolbar style={cardStyles.buttonToolbarEditMode}>
            <Button style={cardStyles.button} onClick={this.handleAddButtonClick} size='sm' variant='info'>
              Add
            </Button>
            <Button style={cardStyles.button} onClick={this.handleSaveButtonClick} size='sm' variant='info'>
              Save
            </Button>
            <Button style={cardStyles.button} onClick={this.closeTooltip} size='sm' variant='secondary'>
              Cancel
            </Button>
          </ButtonToolbar>}
      </div>
    );
  }

  render() {
    return (
      <Fade in={this.props.show}>
        <div id='tooltip'>
          {this.props.selectedNode ? this.displayTooltip() : null}
          {this.displayModal()}
        </div>
      </Fade>
    );
  }
}
