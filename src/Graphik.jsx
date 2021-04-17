import React, { Component } from 'react';
import Graph from './d3-tools/Graph';
import styles from './styles.module.css';
import Button from 'react-bootstrap/Button';
import AddNodeModal from './d3-tools/AddNodeModal';

const canvasWidth = '100%';
const canvasHeight = '500';

const nodeWidth = 50;
const nodeHeight = 50;

// Add a save button.

export class Graphik extends Component {
  constructor(props) {
    super(props);

    this.mapNodesToEdges();
    this.saveGraph = this.saveGraph.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.handleAddNodeClick = this.handleAddNodeClick.bind(this);
    this.addNewNode = this.addNewNode.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    this.state = {
      nodes: props.data.nodes,
      edges: props.data.edges,
      nodeWidth,
      nodeHeight,
      removeNode: this.removeNode,
      addNode: this.handleAddNodeClick,
      showAddNodeModal: false,
      newNodeXPosition: null,
      newNodeYPosition: null
    };
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
      const sourceNode = this.props.data.nodes.filter(node => node.id === edge.source);
      const targetNode = this.props.data.nodes.filter(node => node.id === edge.target);
      // Add error handling for if a node is not found

      edge.source = sourceNode[0];
      edge.target = targetNode[0];
    });
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
    // console.log(d);
    console.log(e);
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

  render() {
    return (
      <div id='svgContainer' className={styles.svgContainer}>
        <button onClick={this.saveGraph} className={styles.saveButton}>
          Save
        </button>
        <Graph {...this.state} />
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
