import * as d3 from 'd3';
function dragStarted (simulation, dat) {
  console.log(this);

  d3.select(this).attr('stroke', 'red');
}

function dragged (event, d, r) {
  // simulation.restart();
  console.log(r);

  d3.select(r).raise()
    .attr('x', d.x = event.x)
    .attr('y', d.y = event.y);
}

function dragEnded(r) {
  // simulation.stop();

  d3.select(r).attr('stroke', 'black');
}

export default {
  dragStarted,
  dragged,
  dragEnded
};
