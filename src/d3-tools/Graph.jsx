import React, { Component } from 'react';
import * as d3 from 'd3';
import { addDefaultNodeAttributes } from './node-attributes';

import NodeTooltip from './node-tooltip/NodeTooltip';
import EdgeTooltip from './edge-tooltip/EdgeTooltip';

import dragFuncs from './node-drag';
import { setCanvasReference, setGraphContainerReference, setSvgBackgroundReference } from './reference-setter';
import { setContainerContextMenuEvent, setEdgeClick, setEdgeContextMenuEvent, setNodeClick, setNodeContextMenuEvent } from './event-listener-setters';
import { endNewEdgeCreation, moveNewEdge, startNewEdgeCreation } from './new-edge-creation';

const simulation = d3.forceSimulation().alpha(0);
const linkGen = d3.linkVertical();

let isEdgeBeingCreated = false;

class Graph extends Component {
  constructor(props) {
    super(props);

    this.containerRefs = React.createRef();
    this.forceTick = this.forceTick.bind(this);
    this.turnNodeTooltipOn = this.turnNodeTooltipOn.bind(this);
    this.turnNodeTooltipOff = this.turnNodeTooltipOff.bind(this);

    this.turnEdgeTooltipOn = this.turnEdgeTooltipOn.bind(this);
    this.turnEdgeTooltipOff = this.turnEdgeTooltipOff.bind(this);

    this.createNewLine = this.createNewLine.bind(this);
    this.getIsEdgeBeingCreated = this.getIsEdgeBeingCreated.bind(this);
    this.setIsEdgeBeingCreated = this.setIsEdgeBeingCreated.bind(this);
    this.zoomed = this.zoomed.bind(this);

    simulation.on('tick', this.forceTick);

    this.nodeContextMenu = [
      {
        title: 'Remove Node',
        action: this.props.removeNode
      },
      {
        title: 'Create Edge',
        action: this.createNewLine
      }
    ];

    this.backgroundContextMenu = [
      {
        title: 'Add Node',
        action: this.props.addNode
      }
    ];

    this.edgeContextMenu = [
      {
        title: 'Remove Edge',
        action: this.props.removeEdge
      }
    ];

    this.state = {
      showNodeTooltip: false,
      showEdgeTooltip: false,
      selectedNode: null,
      selectedEdge: null
    };
  }

  componentDidMount() {
    this.parentSvg = setCanvasReference(this.containerRefs.current);
    this.graphContainer = setGraphContainerReference(this.containerRefs.current);
    this.svgContainer = setSvgBackgroundReference(this.containerRefs.current);

    setContainerContextMenuEvent(this.svgContainer, this.backgroundContextMenu);
    // setContainerClickEvent(this.svgContainer, isEdgeBeingCreated, this.parentSvg);
    // this.svgBackground.on('contextmenu', d3ContextMenu(this.backgroundContextMenu));
    this.renderLinks(this.props.edges);
    this.renderNodes();
    this.renderTexts();
    this.calculateTextWidth();
    this.setSimulation();
    this.setZoom();
  }

  setZoom() {
    this.parentSvg.call(d3.zoom()
      .extent([[0, 0], [this.props.config.svgCanvasWidth, this.props.config.svgCanvasHeight]])
      .scaleExtent([0.1, 8])
      .on('zoom', this.zoomed));
  }

  zoomed({ transform }) {
    this.graphContainer.attr('transform', transform);
  }

  componentDidUpdate() {
    const edges = this.props.calculateLinks(this.props.edges);
    this.renderLinks(edges);
    this.renderNodes();
    // These 2 are only here for when adding nodes, not very efficient...
    // if (this.props.nodes.length !== this.nodes.length) {
    // this.renderTexts();
    this.setSimulation();
    this.forceTick();
    // }
  }

  setSimulation() {
    simulation.nodes(this.props.nodes)
      .force('link', d3.forceLink(this.props.edges).id(d => d.id))
      .restart();
  }

  renderLinks(edges) {
    this.lines = this.graphContainer.selectAll('path')
      .data(edges);

    this.lines.enter().append('path')
      .merge(this.lines)
      .attrs({
        class: 'edge',
        fill: 'none',
        stroke: 'black',
        'stroke-width': 2,
        oppacity: 0,
        d: linkGen
      });
    setEdgeContextMenuEvent(this.lines, this.edgeContextMenu);
    setEdgeClick(this.lines, this.turnEdgeTooltipOn);
  }

  createNewLine(d, ev) {
    isEdgeBeingCreated = true;
    startNewEdgeCreation(ev);

    this.svgContainer.on('mousemove', (e) => isEdgeBeingCreated ? moveNewEdge(e, this.parentSvg) : null);
    this.graphContainer.on('mousemove', (e) => isEdgeBeingCreated ? moveNewEdge(e, this.parentSvg) : null);

    this.svgContainer.on('click', (e) => {
      if (isEdgeBeingCreated) {
        endNewEdgeCreation(e, this.parentSvg, this.props.addNewEdge);
        isEdgeBeingCreated = false;
      }
    });
  }

  renderNodes() {
    this.nodeGroups = this.graphContainer.selectAll('g.nodeGroup').data(this.props.nodes, d => d.id);

    this.nodes = this.nodeGroups
      .enter()
      .append('g')
      .attr('class', 'nodeGroup')
      .attr('id', d => `${d.id}_group`)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .append('rect');

    addDefaultNodeAttributes(this.nodes, this.props);

    this.nodes.call(d3.drag()
      .on('start', dragFuncs.dragStarted)
      .on('drag', (event, d) => dragFuncs.dragged(event, d, simulation))
      .on('end', dragFuncs.dragEnded));

    setNodeClick(this.nodes, this.getIsEdgeBeingCreated, this.setIsEdgeBeingCreated, this.turnNodeTooltipOn, endNewEdgeCreation, this.parentSvg, this.props.addNewEdge);
    setNodeContextMenuEvent(this.nodes, this.nodeContextMenu);

    this.nodeGroups.exit().remove();
  }

  getIsEdgeBeingCreated() {
    return isEdgeBeingCreated;
  }

  setIsEdgeBeingCreated(val) {
    isEdgeBeingCreated = val;
  }

  turnNodeTooltipOn(event) {
    this.setState((state) => {
      return {
        showNodeTooltip: state.showNodeTooltip ? event.target !== state.selectedNode : true,
        selectedNode: event.target
      };
    });
  }

  // Add some kind of logic to update the names on the fields
  turnNodeTooltipOff() {
    this.setState({
      showNodeTooltip: false,
      selectedNode: null
    });
  }

  turnEdgeTooltipOn(event) {
    console.log(event.target);
    console.log(this.state);
    this.setState((state) => {
      return {
        showEdgeTooltip: state.showEdgeTooltip ? event.target !== state.selectedEdge : true,
        selectedEdge: event.target
      };
    });
  }

  // Add some kind of logic to update the names on the fields
  turnEdgeTooltipOff() {
    this.setState({
      showEdgeTooltip: false,
      selectedEdge: null
    });
  }

  renderTexts() {
    this.texts = this.graphContainer.selectAll('.nodeGroup')
      .append('text')
      .attrs({
        id: d => 'text_' + d.id,
        x: d => d.x + (this.props.config.nodeWidth / 2),
        y: d => d.y + (this.props.config.nodeHeight / 2)
      })
      .attr('fill', d => d.fontColour ? d.fontColour : this.props.config.nodeFontColour);

    this.props.nodes.forEach(node => {
      const textEl = d3.select(`text#text_${node.id}`);
      const xPos = textEl.node().getAttribute('x');
      const splitName = node.name.split(' ');
      // console.log(splitName.length === 1);
      if (splitName.length > 1 && node.name.length > 7) {
        for (const wordIndex in splitName) {
          textEl.append('tspan').text(splitName[wordIndex])
            .attr('dy', wordIndex === '0' ? `${-0.35 * (splitName.length - 1)}em` : '1.2em')
            .attr('x', xPos);
        }
      } else {
        textEl.append('tspan').text(node.name);
      }
    });
  }

  calculateTextWidth() {
    this.texts
      .attr('font-size', (d, i, els) => {
        const thisTextBox = els[i].getBBox();
        const widthScale = (this.props.config.nodeWidth - 5) / thisTextBox.width;
        const heightScale = (this.props.config.nodeHeight - 10) / thisTextBox.height;
        const scale = Math.min(widthScale, heightScale, 0.85);
        return `${scale}em`;
      });
  }

  // Tick tock
  forceTick() {
    console.log('tiktok');

    this.nodes.attrs({
      x: d => d.x,
      y: d => d.y
    });

    this.texts.attrs({
      x: d => d.x + (this.props.config.nodeHeight / 2),
      y: d => d.y + (this.props.config.nodeHeight / 2)
    });

    this.texts.selectAll('tspan').attr('x', d => d.x + (this.props.config.nodeHeight / 2));

    const edges = this.props.calculateLinks(this.props.edges);
    this.renderLinks(edges);
    this.texts.raise();
  }

  render() {
    console.log('🚀 ~ Graph.jsx Rendered');
    return (
      <div ref={this.containerRefs}>
        <NodeTooltip show={this.state.showNodeTooltip} turnOff={this.turnNodeTooltipOff} selectedNode={this.state.selectedNode} reRender={this.props.callRerender} />
        <EdgeTooltip show={this.state.showEdgeTooltip} turnOff={this.turnEdgeTooltipOff} selectedEdge={this.state.selectedEdge} reRender={this.props.callRerender} />
        <svg className='canvas' width={this.props.config.svgCanvasWidth} height={this.props.config.svgCanvasHeight}>
          <rect className='background' width='100%' height='100%' fill={this.props.config.svgCanvasBackgroundColour} />
          <g className='graph' />
        </svg>
      </div>
    );
  }
}

export default Graph;
