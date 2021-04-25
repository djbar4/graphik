
import * as d3 from 'd3';

let node;
let prevClass;

function dragStarted (event) {
  node = getNodeFromEvent(event);
  prevClass = node.getAttribute('class');
  d3.select(node).attr('class', 'node-dragging');
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
    d3.select(node).attr('class', prevClass);
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
