import * as d3 from 'd3';
import drag from './node-drag';
import { addDefaultNodeAttributes } from './node-attributes';

const D3Node = {};

D3Node.create = (data) => {
  const rects = d3.select('svg.canvas')
    .append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(data)
    .join('rect');

  addDefaultNodeAttributes(rects);

  rects.call(d3.drag().on('start', drag.dragStarted)
    .on('drag', drag.dragged)
    .on('end', drag.dragEnded)
    .container(d3.select('svg.canvas')));

  console.log('meh');
  console.log(rects);
  return rects;
};

export default D3Node;
