import React, { Component } from 'react';
import * as d3 from 'd3';
import { addDefaultNodeAttributes as addNodeAttributes } from './node-attributes';

import NodeTooltip from './node-tooltip/NodeTooltip';
import EdgeTooltip from './edge-tooltip/EdgeTooltip';

import dragFuncs from './node-drag';
import { setCanvasReference, setGraphContainerReference, setSvgBackgroundReference } from './reference-setter';
import { setContainerContextMenuEvent, setEdgeClick, setEdgeContextMenuEvent, setNodeClick, setNodeContextMenuEvent } from './event-listener-setters';
import { endNewEdgeCreation, moveNewEdge, startNewEdgeCreation } from './new-edge-creation';

/* eslint-disable no-multi-spaces */

const simulation = d3.forceSimulation().alpha(0);

let isEdgeBeingCreated = false;

class Graph extends Component {
  constructor(props) {
    super(props);

    // Creates a reference object which can be assigned to an element.
    // This element can then be access by D3 in other parts of the code.
    this.containerRefs = React.createRef();

    this.forceTick = this.forceTick.bind(this);
    this.turnNodeTooltipOn = this.turnNodeTooltipOn.bind(this);
    this.turnNodeTooltipOff = this.turnNodeTooltipOff.bind(this);

    this.turnEdgeTooltipOn = this.turnEdgeTooltipOn.bind(this);
    this.turnEdgeTooltipOff = this.turnEdgeTooltipOff.bind(this);

    this.createNewEdge = this.createNewEdge.bind(this);
    this.getIsEdgeBeingCreated = this.getIsEdgeBeingCreated.bind(this);
    this.setIsEdgeBeingCreated = this.setIsEdgeBeingCreated.bind(this);
    this.zoomed = this.zoomed.bind(this);

    simulation.on('tick', this.forceTick);

    // Context menus with options for when different parts of the graph are right clicked.
    this.contextMenus = {
      nodeContextMenu: [
        {
          title: 'Remove Node',
          action: this.props.removeNode
        },
        {
          title: 'Create Edge',
          action: this.createNewEdge
        }
      ],
      backgroundContextMenu: [
        {
          title: 'Add Node',
          action: this.props.addNode
        }
      ],
      edgeContextMenu: [
        {
          title: 'Remove Edge',
          action: this.props.removeEdge
        }
      ]
    };

    this.state = {
      showNodeTooltip: false,
      showEdgeTooltip: false,
      selectedNode: null,
      selectedEdge: null,
      originEdgeRef: null
    };
  }

  componentDidMount() {
    // Below functions assign different SVG elements on the screen to variables for
    // ease of accessibility in other parts of the code
    this.parentSvg = setCanvasReference(this.containerRefs.current);
    this.graphContainer = setGraphContainerReference(this.containerRefs.current);
    this.svgContainer = setSvgBackgroundReference(this.containerRefs.current);

    // Sets context menu to appear when right clicking on graph background
    setContainerContextMenuEvent(this.svgContainer, this.contextMenus.backgroundContextMenu);

    // Different parts of the graph are rendered one after another.
    this.calculateEdges();
    this.renderEdges();
    this.renderNodes();
    this.renderNodeTexts();
    this.calculateTextWidth();

    // Sets zoom in and out functionality when using scroll wheel
    this.setZoom();

    // Needs to be called in order to render graph in correct position
    this.forceTick();
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
    this.calculateEdges();
    this.renderEdges();
    this.renderNodes();
    this.forceTick();
  }

  /*
  - Changes the shape of the edges objects so that it can be read by the d3 linking function used when rendering edges.
  - Specifically the 'source' and 'target' values are required to be in the shape of [x, y] to determine how to draw the edge
  */
  calculateEdges() {
    this.calcEdges = this.props.edges.reduce((arr, curr) => {
      // Uses source and target node positions, along with the size of the nodes to draw the edges between the centers of each node.
      const source = [curr.source.x + (this.props.config.nodeWidth / 2), curr.source.y + (this.props.config.nodeHeight / 2)];
      const target = [curr.target.x + (this.props.config.nodeWidth / 2), curr.target.y + (this.props.config.nodeHeight / 2)];
      const id = `${curr.source.id}_${curr.target.id}_edge`;
      const attributes = { ...curr.attributes, sourceNode: curr.source.id, targetNode: curr.target.id };
      arr.push({ source, target, id, attributes });
      return arr;
    }, []);
  }

  /*
  - Renders the edges based on the source nodes x and y positions calculated in the calculateEdges function.
  - The code below creates a new 'g' group element per edge create.
  - Each of these groups contains:
      - A 'path' element which renders the edge
      - A 'textPath' element which renders any text (by default 'textPath' elements are rendered inside 'text' elements)
  */
  renderEdges() {
    this.lines = this.graphContainer
      .selectAll('g.path-group>path')
      .data(this.calcEdges);

    const pathGroup = this.lines
      .enter()
      .append('g')
      .attr('class', 'path-group');

    this.addPathElement(pathGroup);
    this.addTextPathElement(pathGroup);

    setEdgeContextMenuEvent(this.lines, this.contextMenus.edgeContextMenu);
    setEdgeClick(this.lines, this.turnEdgeTooltipOn);
  }

  /*
  - Adds a 'path' element to the a 'g' element passed in.
  - TALK ABOUT PATH BEING A COMPLEX ELEMENT IN REPORT
  */
  addPathElement(pathGroup) {
    pathGroup.append('path')  // Add 'path' element
      .merge(this.lines)      // Determines if 'path' already exists inside group
      .attrs({                // Assigns attributes to elements
        id: d => d.id,
        class: 'edge',
        fill: 'none',
        stroke: d => d.attributes.stroke ? d.attributes.stroke : this.props.config.edgeStroke,
        'stroke-width': 2,
        oppacity: 0,
        d: d3.linkVertical()  // Uses d3 library to assign data points to 'path' element
      });
  }

  addTextPathElement(pathGroup) {
    pathGroup.append('text')
      .style('fill', d => d.attributes.fontColour ? d.attributes.fontColour : this.props.config.edgeFontColour)
      .style('font-weight', 100)
      .style('font-size', '0.65rem')
      .attr('dy', '-3px')
      .append('textPath')
      .data(this.calcEdges)
      .attr('class', 'text-paths')
      .attr('href', d => `#${d.id}`)
      .attr('startOffset', '50%')
      .html(d => d.attributes.text);
  }

  createNewEdge(d, ev) {
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

  /*
  - Renders each node by creating a 'g' group element similar to the creation of edges.
  - Assigns event handlers for each each node for dragging and clicking on them.
  */
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

    addNodeAttributes(this.nodes, this.props);

    // Adds event handler for dragging node.
    this.nodes.call(d3.drag()
      .on('start', dragFuncs.dragStarted)
      .on('drag', (event, d) => dragFuncs.dragged(event, d, simulation))
      .on('end', dragFuncs.dragEnded));

    // Adds event handler for left and right clicking on a node
    setNodeClick(this.nodes, this.getIsEdgeBeingCreated, this.setIsEdgeBeingCreated, this.turnNodeTooltipOn, endNewEdgeCreation, this.parentSvg, this.props.addNewEdge);
    setNodeContextMenuEvent(this.nodes, this.contextMenus.nodeContextMenu);

    // D3 logic for removing nodes from a graph if it receives less data when rerendered.
    this.nodeGroups.exit().remove();
  }

  getIsEdgeBeingCreated() {
    return isEdgeBeingCreated;
  }

  setIsEdgeBeingCreated(val) {
    isEdgeBeingCreated = val;
  }

  turnNodeTooltipOn(event) {
    if (this.state.showEdgeTooltip) {
      this.turnEdgeTooltipOff();
    }
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
    if (this.state.showNodeTooltip) {
      this.turnNodeTooltipOff();
    }
    const selectedEdge = event.target;
    const originEdgeRef = this.props.edges.filter(e =>
      e.source.id === selectedEdge.__data__.attributes.sourceNode &&
      e.target.id === selectedEdge.__data__.attributes.targetNode)[0];

    this.setState((state) => {
      return {
        showEdgeTooltip: state.showEdgeTooltip ? selectedEdge !== state.selectedEdge : true,
        selectedEdge,
        originEdgeRef
      };
    });
  }

  // Add some kind of logic to update the names on the fields
  turnEdgeTooltipOff() {
    this.setState({
      showEdgeTooltip: false,
      selectedEdge: null,
      originEdgeRef: null
    });
  }

  // Renders text inside the nodes by appending a 'text' element to each node group
  renderNodeTexts() {
    this.texts = this.graphContainer.selectAll('.nodeGroup')
      .append('text')
      .attrs({
        id: d => 'text_' + d.id,
        x: d => d.x + (this.props.config.nodeWidth / 2),
        y: d => d.y + (this.props.config.nodeHeight / 2)
      })
      .attr('fill', d => d.fontColour ? d.fontColour : this.props.config.nodeFontColour);

    this.splitNodesAcrossLines();
  }

  /*
  - Splits the nodes across multiple lines by splitting the text into single words,
  - rendering them one after another with a lower y position on the screen.
  */
  splitNodesAcrossLines() {
    this.props.nodes.forEach(node => {
      const textEl = d3.select(`text#text_${node.id}`);
      const xPos = textEl.node().getAttribute('x');
      const splitName = node.name.split(' ');
      if (splitName.length > 1 && node.name.length > 7) {
        for (const wordIndex in splitName) {
          textEl.append('tspan').text(splitName[wordIndex])
            .attr('dy', wordIndex === '0'
              ? `${-0.35 * (splitName.length - 1)}em`
              : '1.2em'
            )
            .attr('x', xPos);
        }
      } else {
        textEl.append('tspan').text(node.name);
      }
    });
  }

  // Changes the font size of the text based on the width of the node
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

  /*
  - Calls the function which is called everytime a node or edge is interacted with.
  - This updates the nodes, texts, and edge positions by updating x and y positions and re-rendering the graph.
  */
  forceTick() {
    this.nodes.attrs({
      x: d => d.x,
      y: d => d.y
    });

    this.texts.attrs({
      x: d => d.x + (this.props.config.nodeWidth / 2),
      y: d => d.y + (this.props.config.nodeHeight / 2)
    });

    this.texts.selectAll('tspan')
      .attr('x', d => d.x + (this.props.config.nodeWidth / 2));

    this.calculateEdges();
    this.renderEdges();
    this.texts.raise();

    // This part makes the text on an edge align correctly when dragging nodes around.
    this.graphContainer.selectAll('.text-paths')
      .data(this.calcEdges)
      .attr('side', d => {
        const x = d.source[0] - d.target[0];
        return x >= '0' ? 'right' : 'left';
      });
  }

  render() {
    return (
      <div ref={this.containerRefs /* This creates the reference for D3 to access and manipulate svg object below */}>
        <NodeTooltip
          show={this.state.showNodeTooltip}
          turnOff={this.turnNodeTooltipOff}
          selectedNode={this.state.selectedNode}
          reRender={this.props.callRerender}
        />
        <EdgeTooltip
          show={this.state.showEdgeTooltip}
          turnOff={this.turnEdgeTooltipOff}
          selectedEdge={this.state.selectedEdge}
          originEdgeRef={this.state.originEdgeRef}
          reRender={this.props.callRerender}
        />
        <svg className='canvas' width={this.props.config.svgCanvasWidth} height={this.props.config.svgCanvasHeight}>
          {/* All D3 operation occur in this SVG. The 'rect' below is used to create the background colour */}
          <rect className='background' width='100%' height='100%' fill={this.props.config.svgCanvasBackgroundColour} />
          <g className='graph' />
        </svg>
      </div>
    );
  }
}

export default Graph;
