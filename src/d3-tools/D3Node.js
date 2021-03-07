import * as d3 from 'd3';
import drag from './D3NodeDrag';
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
    .on('end', drag.dragEnded));
};

export default D3Node;
