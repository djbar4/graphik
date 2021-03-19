import React, { Component } from 'react';
import * as d3 from 'd3';
import styles from '../styles.module.css';

import { addDefaultNodeAttributes } from './node-attributes';

const widthOffset = 15;
const heightOffset = 15;

const simulation = d3.forceSimulation()
  .alpha(0.2);

const linkGen = d3.linkVertical();

class Graph extends Component {
  constructor(props) {
    super(props);
    this.containerRefs = React.createRef();

    this.forceTick = this.forceTick.bind(this);
    simulation.on('tick', this.forceTick);
  }

  componentDidMount() {
    this.container = d3.select(this.containerRefs.current).append('g');
    this.calculateLinks();
    this.renderLinks();
    this.renderNodes();
    this.setSimulation();
  }

  setSimulation() {
    simulation.nodes(this.props.nodes)
      .force('link', d3.forceLink(this.props.edges).id(d => d.id))
      .restart();
  }

  calculateLinks() {
    this.calcEdges = this.props.edges.reduce((arr, curr) => {
      const source = [curr.source.x + widthOffset, curr.source.y + heightOffset];
      const target = [curr.target.x + widthOffset, curr.target.y + heightOffset];
      arr.push({ source: source, target: target });
      return arr;
    }, []);
  }

  renderLinks() {
    this.lines = this.container.selectAll('path')
      .data(this.calcEdges)
      .join('path');

    this.lines.attrs({
      class: styles.line,
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      oppacity: 0,
      d: linkGen
    });
  }

  renderNodes() {
    this.nodes = this.container.selectAll('.node')
      .data(this.props.nodes, d => d.id)
      .join('rect');

    addDefaultNodeAttributes(this.nodes);

    this.nodes.call(d3.drag().on('start', this.dragStarted)
      .on('drag', this.dragged)
      .on('end', this.dragEnded));
  }

  forceTick() {
    console.log('');
    this.nodes.attrs({
      x: d => d.x,
      y: d => d.y
    });
    this.calculateLinks();
    this.renderLinks();
  }

  dragStarted () {
    d3.select(this).attr('stroke', 'red');
  }

  dragged (event, d) {
    simulation.restart();
    d3.select(this).raise()
      .attr('x', d.x = event.x)
      .attr('y', d.y = event.y);
  }

  dragEnded() {
    d3.select(this).attr('stroke', 'black');
    simulation.stop();
  }

  render() {
    return (
      <g className='graph' ref={this.containerRefs} />
    );
  }
}

export default Graph;
