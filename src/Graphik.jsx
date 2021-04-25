import React, { Component } from 'react';
import Graph from './d3-tools/Graph';
import styles from './styles.module.css';
import Button from 'react-bootstrap/Button';
import AddNodeModal from './d3-tools/AddNodeModal';

// Add a save button.

const config = {
  nodeWidth: 50,
  nodeHeight: 50,
  nodeRx: 10

};

export class Graphik extends Component {
  constructor(props) {
    console.log('constructin graphik');
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

    this.calculateLinks = this.calculateLinks.bind(this);

    this.mergeUserConfig(props.userConfig, config);

    this.state = {
      nodes: props.data.nodes,
      removeNode: this.removeNode,
      addNode: this.handleAddNodeClick,
      addNewEdge: this.addNewEdge,
      removeEdge: this.removeEdge,
      callRerender: this.callRerender,
      calculateLinks: this.calculateLinks,
      showAddNodeModal: false,
      newNodeXPosition: null,
      newNodeYPosition: null,
      config
    };
    this.mapNodesToEdges();
    this.state.edges = this.calculateLinks(props.data.edges);
  }

  mergeUserConfig(userConfig, config) {
    for (const k in userConfig) {
      config[k] = userConfig[k];
    }
  }

  calculateLinks(edges) {
    // A new variable is made here, so it is not longer the same reference as the prop.
    // Putting this logic in the parent is worth a shot.
    const conf = this.state.config;
    return edges.reduce((arr, curr) => {
      const source = [curr.sourceNode.x + (conf.nodeWidth / 2), curr.sourceNode.y + (conf.nodeHeight / 2)];
      const target = [curr.targetNode.x + (conf.nodeWidth / 2), curr.targetNode.y + (conf.nodeHeight / 2)];
      const id = `${curr.sourceNode.id}_${curr.targetNode.id}_edge`;
      const attributes = { ...curr.attributes, sourceNode: curr.sourceNode.id, targetNode: curr.targetNode.id };
      arr.push({ source, target, id, attributes, sourceNode: curr.sourceNode, targetNode: curr.targetNode });
      return arr;
    }, []);
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
      edge.sourceNode = edge.sourceNode.id;
      edge.targetNode = edge.targetNode.id;
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
    });
  }

  mapNodesToEdge(edge) {
    const sourceNode = this.state.nodes.filter(node => node.id === (edge.sourceNode.id ? edge.sourceNode.id : edge.sourceNode));
    const targetNode = this.state.nodes.filter(node => node.id === (edge.targetNode.id ? edge.targetNode.id : edge.targetNode));
    // Add error handling for if a node is not found

    edge.sourceNode = sourceNode[0];
    edge.targetNode = targetNode[0];
  }

  removeNode(d, e) {
    const tempNodes = this.state.nodes.filter(node => {
      return node.id !== d.id;
    });
    const tempEdges = this.state.edges.filter(edge => {
      return (edge.sourceNode.id !== d.id && edge.targetNode.id !== d.id);
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
      target
    };

    const tempEdges = this.state.edges;
    this.mapNodesToEdge(newEdge);
    tempEdges.push(newEdge);
    this.setState({
      edges: tempEdges
    });
  }

  removeEdge(edge) {
    const newEdges = this.state.edges.filter(e => !(e.sourceNode.id === edge.attributes.sourceNode && e.targetNode.id === edge.attributes.targetNode));
    this.setState({
      edges: newEdges
    });
  }

  callRerender() {
    console.log('called rerender');
    console.log(this.state);

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
