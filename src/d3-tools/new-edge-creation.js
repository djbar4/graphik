import * as d3 from 'd3';

let srcNodeId = null;
let targetNodeId = null;

let newLineData = null;

function startNewEdgeCreation(e) {
  console.log('starting');
  srcNodeId = e.target.getAttribute('id');

  newLineData = [[
    e.layerX, e.layerY,
    e.layerX, e.layerY
  ]];
}

function moveNewEdge(e, el) {
  newLineData[0][2] = d3.pointer(e)[0];
  newLineData[0][3] = d3.pointer(e)[1] + 3; // +3 here or else the click will be on the line being generated, not the node/backgroudn

  const newEdge = el.selectAll('.newEdge')
    .data(newLineData);

  newEdge.enter()
    .append('line')
    .merge(newEdge)
    .attrs({
      class: 'newEdge',
      x1: d => d[0],
      y1: d => d[1],
      x2: d => d[2],
      y2: d => d[3],
      stroke: 'black'
    })
    .raise();
}

function endNewEdgeCreation(e, el, addNewEdge) {
  el.selectAll('.newEdge').remove();

  if (e.target.parentElement.getAttribute('class') === 'nodeGroup') {
    targetNodeId = e.target.getAttribute('id');
    addNewEdge(srcNodeId.split('_')[1], targetNodeId.split('_')[1]);
  }
}

export { startNewEdgeCreation, moveNewEdge, endNewEdgeCreation };
