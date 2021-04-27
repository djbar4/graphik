import React, { Component } from 'react';
import Graph from './d3-tools/Graph';
import styles from './styles.module.css';
import Button from 'react-bootstrap/Button';
import AddNodeModal from './d3-tools/AddNodeModal';

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

export class Graphik extends Component {
  constructor(props) {
    console.log('constructin graphik');
    console.log(props);
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
      nodes: props.data.nodes,
      edges: props.data.edges,
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

  mergeUserConfig(userConfig, config) {
    for (const k in userConfig) {
      config[k] = userConfig[k];
    }
  }

  saveGraph() {
    console.log('Saving Graph');
    console.log(this.state.edges);
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

  mapNodesToEdges() {
    this.props.data.edges.forEach(edge => {
      this.mapNodesToEdge(edge);
      edge.attributes = edge.attributes ? edge.attributes : {};
    });
  }

  mapNodesToEdge(edge) {
    const sourceNode = this.state.nodes.filter(node => node.id === (edge.source.id ? edge.source.id : edge.source));
    const targetNode = this.state.nodes.filter(node => node.id === (edge.target.id ? edge.target.id : edge.target));
    // Add error handling for if a node is not found

    edge.source = sourceNode[0];
    edge.target = targetNode[0];
  }

  removeNode(d, e) {
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
    this.forceUpdate();
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

  addNewNode(id, name, x, y) {
    const newNode = {
      id,
      name,
      x,
      y
    };
    // console.log(newNode);
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
    console.log('GRAPHIX Rerender');
    console.log(this.state);
    return (
      <div id='svgContainer' className={styles.svgContainer}>
        <Button size='sm' onClick={this.saveGraph} variant='info' style={{ position: 'absolute', margin: '2%' }}>
          Save
        </Button>
        {/* Using key here is to remount every time, but this could be made better... */}
        <Graph key={Date.now()} {...this.state} />
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
