import React, { Component } from 'react';
import Graph from './d3-tools/Graph';
import styles from './styles.module.css';
import Button from 'react-bootstrap/Button';
import AddNodeModal from './d3-tools/AddNodeModal';
import _ from 'lodash';
// Add a save button.

const config = {
  nodeWidth: 60,
  nodeHeight: 60,
  nodeRx: 10,
  nodeColour: '#212121',
  nodeStroke: '#65d3ec',
  svgCanvasWidth: 1032,
  svgCanvasHeight: 594,
  svgCanvasBackgroundColour: '#383838',
  nodeFontColour: 'white',
  edgeStroke: 'black',
  edgeFontColour: 'white'

};

export class Graphix extends Component {
  constructor(props) {
    super(props);

    this.mapNodesToEdge = this.mapNodesToEdge.bind(this);
    this.saveGraph = this.saveGraph.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.handleAddNodeClick = this.handleAddNodeClick.bind(this);
    this.addNewNode = this.addNewNode.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.addNewEdge = this.addNewEdge.bind(this);
    this.removeEdge = this.removeEdge.bind(this);
    this.callRerender = this.callRerender.bind(this);

    this.mergeUserConfig(this.props.userConfig ? this.props.userConfig : {}, config);

    this.state = {
      nodes: _.cloneDeep(props.data.nodes),
      edges: _.cloneDeep(props.data.edges),
      removeNode: this.removeNode,
      addNode: this.handleAddNodeClick,
      addNewEdge: this.addNewEdge,
      removeEdge: this.removeEdge,
      callRerender: this.callRerender,
      showAddNodeModal: false,
      newNodeXPosition: null,
      newNodeYPosition: null,
      config
    };
    this.mapNodesToEdges();
  }

  /*
  - Default config values are overriden by the config values supplied by the developer.
  */
  mergeUserConfig(userConfig, config) {
    for (const k in userConfig) {
      config[k] = userConfig[k];
    }
  }

  saveGraph() {
    const formattedData = this.generatedFormattedSavedData();
    this.props.externalSaveGraph(formattedData);
  }

  generatedFormattedSavedData() {
    const data = {
      nodes: JSON.parse(JSON.stringify(this.state.nodes)),
      edges: JSON.parse(JSON.stringify(this.state.edges))
    };

    data.edges.forEach(edge => {
      edge.source = edge.source.id;
      edge.target = edge.target.id;
      delete edge.index;
    });

    data.nodes.forEach(node => {
      delete node.vx;
      delete node.vy;
      delete node.index;
    });

    return data;
  }

  /*
  - Maps Node objects to each edge using mapNodesToEdge(edge) function below.
  - edge.attributes is also set to an empty object {} in case an edge has no attributes.
  */
  mapNodesToEdges() {
    this.state.edges.forEach(edge => {
      this.mapNodesToEdge(edge);
      edge.attributes = edge.attributes ? edge.attributes : {};
    });
  }

  /*
  - Maps Node object to edge.source/edge.target variable based on ID given.
  - E.g. edge.source = 'Node1' ==> edge.source = {id: Node1, Name: '1', x: 10, y: 10}
  */

  mapNodesToEdge(edge) {
    const sourceNode = this.state.nodes.filter(node =>
      node.id === (edge.source.id ? edge.source.id : edge.source)
    );
    const targetNode = this.state.nodes.filter(node =>
      node.id === (edge.target.id ? edge.target.id : edge.target)
    );

    edge.source = sourceNode[0];
    edge.target = targetNode[0];
  }

  removeNode(d) {
    const tempNodes = this.state.nodes.filter(node => {
      return node.id !== d.id;
    });
    const tempEdges = this.state.edges.filter(edge => {
      return (edge.source.id !== d.id && edge.target.id !== d.id);
    });

    this.setState({
      nodes: tempNodes,
      edges: tempEdges
    });
    this.callRerender();
  }

  handleAddNodeClick(d, e) {
    this.setState({
      showAddNodeModal: true,
      newNodeXPosition: e.layerX,
      newNodeYPosition: e.layerY
    });
  }

  handleModalClose() {
    this.setState({ showAddNodeModal: false });
  }

  /*
  - Adding a new node requires an id, name, and xy positions
  - Once the new node is added, the change in state of the 'nodes' variable will cause the graph to rerender.
   */
  addNewNode(id, name, x, y) {
    const newNode = { id, name, x, y };
    const tempNodes = this.state.nodes;

    tempNodes.push(newNode);

    this.setState({
      nodes: tempNodes
    });
  }

  addNewEdge(source, target) {
    // Add logic to check if edge already exists between nodes or if node is itself
    const newEdge = {
      source,
      target,
      attributes: {}
    };

    const tempEdges = this.state.edges;
    this.mapNodesToEdge(newEdge);
    tempEdges.push(newEdge);
    this.setState({
      edges: tempEdges
    });
  }

  removeEdge(edge) {
    const newEdges = this.state.edges.filter(e => !(e.source.id === edge.attributes.sourceNode && e.target.id === edge.attributes.targetNode));
    this.setState({
      edges: newEdges
    });
  }

  callRerender() {
    this.forceUpdate();
  }

  render() {
    return (
      <div id='svgContainer' className={styles.svgContainer}>
        <Button
          size='sm'
          onClick={this.saveGraph /* Links to the function passed in by the user for what to do when the save button is clicked */}
          variant='info'
          style={{ position: 'absolute', margin: '2%' }}
        >
          Save
        </Button>
        <Graph
          key={Date.now() /* Key here is required so React re-renders the Graph everytime a change is made */}
          {...this.state /* List of attributes that have + sign next to them on the class diagram */}
        />
        <AddNodeModal
          show={this.state.showAddNodeModal}
          handleClose={this.handleModalClose}
          addNewNode={this.addNewNode}
          xPos={this.state.newNodeXPosition}
          yPos={this.state.newNodeYPosition}
        />
      </div>
    );
  }
}
