
import * as d3 from 'd3';

let node;

function dragStarted (event) {
  node = getNodeFromEvent(event);
  d3.select(node).attr('stroke', 'red');
}

function dragged (event, d, simulation) {
  simulation.restart();
  d3.select(node.parentElement).raise();
  d3.select(node).raise()
    .style('opacity', 1)
    .attr('x', d.x = event.x)
    .attr('y', d.y = event.y);
}

function dragEnded(event) {
  if (!node.clicked) {
    d3.select(node).attr('stroke', 'black');
  }
}

function getNodeFromEvent(event) {
  return event.sourceEvent.target;
}

export default {
  dragStarted,
  dragged,
  dragEnded
};
