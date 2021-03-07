import * as d3 from 'd3';

const D3Edge = {};

D3Edge.create = (data) => {
  const nodesGroup = d3.select('svg').select('g.nodes');
  console.log('hy');
  nodesGroup.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attrs({
      class: 'arc',
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      oppacity: 0.25,
      d: someFunc
    });
};

const someFunc = (d, i) => {
  console.log(d);
  var draw = d3.line().curve(d3.curveBasis);
  var midX = (d.source.x + d.target.x) / 2;
  var midY = (d.source.x - d.target.x);
  console.log(`source x: ${d.source.x}`);
  console.log(`target x: ${d.target.x}`);
  console.log(`midX: ${midX}`);
  console.log(`midY: ${midY}`);
  // return draw([100, 50], [200, 60], [300, 70]);
  return draw([[d.source.x + 15, 40], [midX + 15, 0], [d.target.x + 15, 40]]);
};

export default D3Edge;
