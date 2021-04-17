import React, { Component } from 'react';
import * as d3 from 'd3';
import { addDefaultNodeAttributes } from './node-attributes';

import Tooltip from './tooltip/Tooltip';

import dragFuncs from './node-drag';
import d3ContextMenu from 'd3-context-menu';

const canvasWidth = '100%';
const canvasHeight = '500';

const simulation = d3.forceSimulation().alpha(0);
const linkGen = d3.linkVertical();

class Graph extends Component {
  constructor(props) {
    super(props);

    this.containerRefs = React.createRef();
    this.forceTick = this.forceTick.bind(this);
    this.turnTooltipOn = this.turnTooltipOn.bind(this);
    this.turnTooltipOff = this.turnTooltipOff.bind(this);

    simulation.on('tick', this.forceTick);
    this.nodeContextMenu = [
      {
        title: 'Remove Node',
        action: this.props.removeNode
      },
      {
        title: 'Create Edge',
        action: () => console.log('TO DO!')
      }
    ];

    this.backgroundContextMenu = [
      {
        title: 'Add Node',
        action: this.props.addNode
      }
    ];

    this.state = {
      showTooltip: false,
      selectedNode: null
    };
  }

  componentDidMount() {
    this.graphContainer = d3.select(this.containerRefs.current).select('.graph');

    this.rectBackground = d3.select(this.containerRefs.current).select('rect');
    this.rectBackground.on('contextmenu', d3ContextMenu(this.backgroundContextMenu));

    this.calculateLinks();
    this.renderLinks();
    this.renderNodes();
    this.renderTexts();
    this.setSimulation();
  }

  componentDidUpdate() {
    this.calculateLinks();
    this.renderLinks();
    this.renderNodes();
    // These 2 are only here for when adding nodes, not very efficient...
    console.log(this.props.nodes.length);
    console.log(this.nodes);
    // if (this.props.nodes.length !== this.nodes.length) {
    //   this.renderTexts();
    //   this.setSimulation();
    // }
  }

  setSimulation() {
    simulation.nodes(this.props.nodes)
      .force('link', d3.forceLink(this.props.edges).id(d => d.id))
      .restart();
  }

  calculateLinks() {
    this.calcEdges = this.props.edges.reduce((arr, curr) => {
      const source = [curr.source.x + (this.props.nodeWidth / 2), curr.source.y + (this.props.nodeHeight / 2)];
      const target = [curr.target.x + (this.props.nodeWidth / 2), curr.target.y + (this.props.nodeHeight / 2)];
      arr.push({ source: source, target: target });
      return arr;
    }, []);
  }

  renderLinks() {
    this.lines = this.graphContainer.selectAll('path')
      .data(this.calcEdges)
      .join('path')
      .attrs({
        class: 'edge',
        fill: 'none',
        stroke: 'black',
        'stroke-width': 2,
        oppacity: 0,
        d: linkGen
      });
  }

  renderNodes() {
    this.nodeGroups = this.graphContainer.selectAll('g.nodeGroup')
      .data(this.props.nodes, d => d.id);

    this.nodes = this.nodeGroups
      .enter()
      .append('g')
      .attr('class', 'nodeGroup')
      .attr('id', d => `${d.id}_group`)
      .append('rect');

    addDefaultNodeAttributes(this.nodes, this.props);

    this.nodes.call(d3.drag().on('start', dragFuncs.dragStarted)
      .on('drag', (event, d) => {
        dragFuncs.dragged(event, d, simulation);
      })
      .on('end', dragFuncs.dragEnded));

    // this.nodes.on('click', tooltipFuncs.displayTooltip);
    this.nodes.on('click', this.turnTooltipOn);
    this.nodes.on('contextmenu', d3ContextMenu(this.nodeContextMenu));

    this.nodeGroups.exit().remove();
  }

  turnTooltipOn(event) {
    this.setState((state) => {
      const showTooltip = state.showTooltip ? event.target !== state.selectedNode : true;
      return {
        showTooltip: showTooltip,
        selectedNode: event.target
      };
    });
  }

  // Add some kind of logic to update the names on the fields
  turnTooltipOff() {
    this.setState({
      showTooltip: false,
      selectedNode: null
    });
  }

  renderTexts() {
    this.texts = this.graphContainer.selectAll('g.nodeGroup').append('text');
    this.texts
      .text(d => d.name)
      .attrs({
        id: d => d.id + '_text'
      });
  }

  // Tick tock
  forceTick() {
    console.log('tiktok');
    console.log(this.texts);
    this.nodes.attrs({
      x: d => d.x,
      y: d => d.y
    });

    this.texts.attrs({
      x: d => d.x + (this.props.nodeWidth / 2),
      y: d => d.y + (this.props.nodeHeight / 2)
    });

    this.calculateLinks();
    this.renderLinks();
    this.texts.raise();
  }

  render() {
    console.log('🚀 ~ Graph.jsx Rendered');
    console.log(this.props);
    return (
      <div ref={this.containerRefs}>
        <Tooltip show={this.state.showTooltip} turnOff={this.turnTooltipOff} selectedNode={this.state.selectedNode} />
        <svg className='canvas' width={canvasWidth} height={canvasHeight}>
          <rect className='background' width='100%' height='100%' fill='#284678' />
          <g className='graph' />
        </svg>
      </div>
    );
  }
}

export default Graph;
