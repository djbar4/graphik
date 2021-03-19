import React, { Component } from 'react';
import D3Node from './d3-tools/D3Node';
import D3Edge from './d3-tools/D3Edge';
// import styles from './styles.module.css';
import * as d3 from 'd3';
import Nodes from './d3-tools/D3Node';
import Edges from './d3-tools/D3Edge';
import Graph from './d3-tools/Graph';

const canvasWidth = 500;
const canvasHeight = 500;

// const nodeWidth = 20;
// const nodeHeight = 20;

const simulation = d3.forceSimulation();

export class Graphik extends Component {
  constructor(props) {
    super(props);

    this.mapNodesToEdges(props.data.nodes, props.data.edges);
    this.forceTick = this.forceTick.bind(this);

    this.state = {
      nodes: props.data.nodes,
      edges: props.data.edges,
      simulation: simulation,
      forceTick: this.forceTick
    };
  }

  updateNodePosition(node, x, y) {
    // This should update the x and y values in the state.
  }

  // componentDidUpdate() {
  //   simulation.on('tick', this.forceTick);
  // }

  componentDidMount() {
    // simulation.on('tick', this.forceTick);
    // this.nodes = D3Node.create(this.props.data.nodes, simulation); // This should get passed data.nodes

    // this.mapNodesToEdges(this.props.data.nodes, this.props.data.edges);

    // this.edges = D3Edge.create(this.props.data.edges); // This should get passed data.edges

    // console.log(this.nodes);
    // console.log(this.edges);
    // simulation.nodes(this.props.data.nodes)
    //   .alpha(0.1)
    //   .force('link', d3.forceLink(this.props.data.edges).id(d => d.id))
    //   .restart();
  }

  mapNodesToEdges(nodes, edges) {
    edges.forEach(edge => {
      const sourceNode = nodes.filter(node => node.id === edge.source);
      const targetNode = nodes.filter(node => node.id === edge.target);
      // Add error handling for if a node is not found

      edge.source = sourceNode[0];
      edge.target = targetNode[0];
    });
  }

  forceTick() {
    console.log('yoooo');
    console.log(this.edges);
    this.nodes.attrs({
      x: d => d.x,
      y: d => d.y
    });

    this.edges.attrs({
      x1: d => d.source.x,
      x2: d => d.target.x,
      y1: d => d.source.y,
      y2: d => d.target.y
    });
  }

  render() {
    return (
      <svg className='canvas' width={canvasWidth} height={canvasHeight}>
        {/* <Edges {...this.state} /> */}
        {/* <Nodes {...this.state} /> */}
        <Graph {...this.state} />
      </svg>
    );
  }
}
