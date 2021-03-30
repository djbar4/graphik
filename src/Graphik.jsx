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
    this.saveGraph = this.saveGraph.bind(this);
    console.log('🚀 ~ propssss', props);

    this.state = {
      nodes: props.data.nodes,
      edges: props.data.edges,
      nodeWidth,
      nodeHeight
    };
  }

  saveGraph() {
    console.log('Saving Graph');
    this.makeDataSavable();
    this.props.externalSaveGraph(this.props.data);
  }

  makeDataSavable() {
    this.props.data.edges.forEach(edge => {
      edge.source = edge.source.id;
      edge.target = edge.target.id;
      delete edge.index;
    });

    this.props.data.nodes.forEach(node => {
      delete node.vx;
      delete node.vy;
      delete node.index;
    });
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
        <button onClick={this.saveGraph}>
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
