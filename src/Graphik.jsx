import React, { Component } from 'react';
import Graph from './d3-tools/Graph';

const canvasWidth = '100%';
const canvasHeight = '500';

const nodeWidth = 50;
const nodeHeight = 50;

// Add a save button.

export class Graphik extends Component {
  constructor(props) {
    super(props);

    this.mapNodesToEdges();

    this.state = {
      nodes: props.data.nodes,
      edges: props.data.edges,
      nodeWidth,
      nodeHeight
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
      <div id='svgContainer'>
        <div id='tooltip' />
        <svg className='canvas' width={canvasWidth} height={canvasHeight}>
          <rect width='100%' height='100%' fill='#284678' />
          <Graph {...this.state} />
        </svg>
      </div>
    );
  }
}
