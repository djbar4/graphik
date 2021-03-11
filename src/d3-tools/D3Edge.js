import * as d3 from 'd3';
import styles from '../styles.module.css';

const D3Edge = {};

D3Edge.create = (data) => {
  // const nodesGroup = d3.select('svg')
  //   .select('g.nodes')
  //   .selectAll('path')
  //   .data(data)
  //   .join('path');

  const nodesGroup = d3.select('svg')
    .append('g')
    .attr('edges', true)
    .selectAll('line')
    .data(data)
    .join('line');

  nodesGroup
    .attrs({
      class: styles.line,
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      oppacity: 0
      // d: someFunc
    });

  return nodesGroup;
};

const someFunc = (d, i) => {
  console.log(d);
  var draw = d3.line().curve(d3.curveBasis);
  var midX = (d.source.x + d.target.x) / 2;
  // var midY = (d.source.x - d.target.x);

  return draw([[d.source.x + 15, 40], [midX + 15, 0], [d.target.x + 15, 40]]);
};

export default D3Edge;
