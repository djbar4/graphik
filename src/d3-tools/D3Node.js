import * as d3 from 'd3';
import drag from './node-drag';
import { addDefaultNodeAttributes } from './node-attributes';
import React, { Component } from 'react';

class Nodes extends Component {
  constructor(props) {
    super(props);
    this.nodes = this.props.nodes;
    this.containerRefs = React.createRef();
  }

  componentDidMount() {
    this.container = d3.select(this.containerRefs.current).append('g');
    this.props.simulation.nodes(this.props.nodes).restart();
    this.renderNodes();
  }

  renderNodes() {
    this.nodes = this.container.selectAll('.node')
      .data(this.nodes, d => d.id)
      .join('rect');

    addDefaultNodeAttributes(this.nodes);

    this.nodes.call(d3.drag().on('start', drag.dragStarted)
      .on('drag', drag.dragged)
      .on('end', drag.dragEnded))
      .merge(this.nodes);
  }

  forceTick() {
    this.nodes.attrs({
      x: d => d.x,
      y: d => d.y
    });
  }

  render() {
    return (
      <g className='nodes' ref={this.containerRefs} />
    );
  }
}

export default Nodes;
