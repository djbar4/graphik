import * as d3 from 'd3';
import React, { Component } from 'react';
import styles from '../styles.module.css';

const linkGen = d3.linkVertical();

class Edges extends Component {
  constructor(props) {
    super(props);
    this.edges = this.props.edges;
    this.containerRefs = React.createRef();
  }

  componentDidMount() {
    this.container = d3.select(this.containerRefs.current).append('g');
    this.calculateLinks();
    this.renderLinks();
    this.props.simulation.force('link', d3.forceLink(this.props.edges).id(d => d.id));
  }

  calculateLinks() {
    this.calcEdges = this.edges.reduce((arr, curr) => {
      console.log(d3.select('FOO'));
      const source = [curr.source.x, curr.source.y];
      const target = [curr.target.x, curr.target.y];
      arr.push({ source: source, target: target });
      return arr;
    }, []);
  }

  renderLinks() {
    console.log(this.calcEdges);
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

  // forceTick() {
  //   this.edges.attrs({
  //     x1: d => d.source.x,
  //     x2: d => d.target.x,
  //     y1: d => d.source.y,
  //     y2: d => d.target.y
  //   });
  // }

  render() {
    return (
      <g className='edges' ref={this.containerRefs} />
    );
  }
}

const D3Edge = {};

D3Edge.create = (data) => {
  // const nodesGroup = d3.select('svg')
  //   .select('g.nodes')
  //   .selectAll('path')
  //   .data(data)
  //   .join('path');

  const nodesGroup = d3.select('svg')
    .append('g')
    .attr('edges', true)
    .selectAll('line')
    .data(data)
    .join('line');

  nodesGroup
    .attrs({
      class: styles.line,
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      oppacity: 0
      // d: someFunc
    });

  return nodesGroup;
};

const someFunc = (d, i) => {
  console.log(d);
  var draw = d3.line().curve(d3.curveBasis);
  var midX = (d.source.x + d.target.x) / 2;
  // var midY = (d.source.x - d.target.x);

  return draw([[d.source.x + 15, 40], [midX + 15, 0], [d.target.x + 15, 40]]);
};

export default Edges;
