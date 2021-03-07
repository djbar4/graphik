import React, { Component } from 'react';
import D3Node from './d3-tools/D3Node';
import D3Edge from './d3-tools/D3Edge';
// import styles from './styles.module.css';

export class Graph extends Component {
  componentDidMount() {
    D3Node.create(this.props.data.nodes); // This should get passed data.nodes
    this.mapNodesToEdges(this.props.data.nodes, this.props.data.edges);
    D3Edge.create(this.props.data.edges); // This should get passed data.edges
  }

  render() {
    return (
      <svg className='canvas' width='500' height='500' />
    );
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
}
