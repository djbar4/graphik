import React, { Component } from 'react';
import Graph from './d3-tools/Graph';

const canvasWidth = 500;
const canvasHeight = 500;

// const nodeWidth = 20;
// const nodeHeight = 20;

export class Graphik extends Component {
  constructor(props) {
    super(props);

    this.mapNodesToEdges();

    this.state = {
      nodes: props.data.nodes,
      edges: props.data.edges
    };
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

  render() {
    return (
      <svg className='canvas' width={canvasWidth} height={canvasHeight}>
        <Graph {...this.state} />
      </svg>
    );
  }
}
