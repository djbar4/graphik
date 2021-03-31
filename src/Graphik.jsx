import React, { Component } from 'react';
import Graph from './d3-tools/Graph';
import styles from './styles.module.css';

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
    this.state = {
      nodes: props.data.nodes,
      edges: props.data.edges,
      nodeWidth,
      nodeHeight,
      removeNode: this.removeNode
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

  render() {
    return (
      <div id='svgContainer' className={styles.svgContainer}>
        <button onClick={this.saveGraph} className={styles.saveButton}>
          Save
        </button>
        <div id='tooltip' />
        <svg className='canvas' width={canvasWidth} height={canvasHeight}>
          <rect width='100%' height='100%' fill='#284678' />
          <Graph {...this.state} />
        </svg>
      </div>
    );
  }
}
