import * as d3 from 'd3';

function dragStarted () {
  d3.select(this).attr('stroke', 'red');
}

function dragged (event, d) {
  d3.select(this).raise()
    .attr('x', d.x = event.x)
    .attr('y', d.y = event.y);
}

function dragEnded() {
  d3.select(this).attr('stroke', 'black');
}

export default {
  dragStarted,
  dragged,
  dragEnded
};
