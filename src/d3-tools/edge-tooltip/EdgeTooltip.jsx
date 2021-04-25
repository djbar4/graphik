import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import { Button, Card, Fade, ButtonToolbar } from 'react-bootstrap';
import NodeAttributes from '../node-tooltip/NodeAttributes';

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

export default class EdgeTooltip extends Component {
  constructor(props) {
    super(props);

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    // this.handleModalClose = this.handleModalClose.bind(this);
    this.updateAttributeValues = this.updateAttributeValues.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);

    this.state = {
      attributes: {},
      selectedEdge: null,
      editMode: false,
      showModal: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedEdge !== prevState.selectedEdge && nextProps.selectedEdge !== null) {
      const attributes = _.cloneDeep(nextProps.selectedEdge.__data__.attributes);
      return {
        attributes,
        selectedEdge: nextProps.selectedEdge
      };
    } else return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.selectedEdge && prevProps.selectedEdge !== this.props.selectedEdge) {
        this.toggleEdgeHighlight(prevProps.selectedEdge, false);
      }
      if (this.props.show) {
        prevClass = this.props.selectedEdge.getAttribute('class');
        this.toggleEdgeHighlight(this.props.selectedEdge, true);
      } else {
        this.toggleEdgeHighlight(prevProps.selectedEdge, false);
      }
      if (this.state.editMode) {
        this.toggleEditMode();
      }
    }
  }

  updateAttributeValues(key, val) {
    const { attributes } = this.state;
    attributes[key] = val;
    this.setState({ attributes });
  }

  toggleEdgeHighlight(edge, highlight) {
    console.log(highlight);
    const _class = highlight ? 'edge-selected' : prevClass;
    d3.select(edge).attr('class', _class);
  }

  toggleEditMode() {
    this.setState((state) => {
      return { editMode: !state.editMode };
    });
  }

  handleSaveButtonClick() {
    console.log('saved');
    console.log(this.props.selectedEdge.__data__.attributes);
    console.log(this.state.attributes);
    for (const k in this.state.attributes) {
      if (this.state.attributes[k] === null) {
        delete this.props.selectedEdge.__data__.attributes[k];
      } else this.props.selectedEdge.__data__.attributes[k] = this.state.attributes[k];
    }
    this.toggleEditMode();
    console.log('this.props.selectedEdge.__data__.attributes');

    console.log(this.props.selectedEdge.__data__.attributes);
    this.props.reRender();
  }

  handleAddButtonClick() {
    this.setState({ showModal: true });
  }

  closeTooltip() {
    this.setState({ selectedEdge: null, editMode: !this.state.editMode });
    this.props.turnOff();
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
          <NodeAttributes attributes={filteredAttrs} editMode={this.state.editMode} updateValues={this.updateAttributeValues} />
        </Card.Body>
        <Card.Footer style={cardStyles.footer}>
          {this.createTooltipButtons()}
        </Card.Footer>
      </Card>
    );
  }

  //   displayModal() {
  //     return (
  //       <AddAttributeModal show={this.state.showModal} handleClose={this.handleModalClose} addAttribute={this.updateAttributeValues} />
  //     );
  //   }

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
          {this.props.selectedEdge ? this.displayTooltip() : null}
          {/* {this.displayModal()} */}
        </div>
      </Fade>
    );
  }
}
