import * as d3 from 'd3';

function setCanvasReference(ref) {
  return d3.select(ref).select('.canvas');
}

function setGraphContainerReference(ref) {
  return d3.select(ref).select('.graph');
}

function setSvgBackgroundReference(ref) {
  return d3.select(ref).select('rect');
}

export {
  setCanvasReference,
  setGraphContainerReference,
  setSvgBackgroundReference
};
