import * as d3 from 'd3';

/*
- Below functions take in as input a reference to the div element in the Graph componenet.
- D3 selects this reference, and then selects children inside that div.
- In all 3 functions, the different children of the ref div are access via their class names, represented using '.className'
*/
function setCanvasReference(ref) {
  return d3.select(ref).select('.canvas');
}

function setSvgBackgroundReference(ref) {
  return d3.select(ref).select('.background');
}
function setGraphContainerReference(ref) {
  return d3.select(ref).select('.graph');
}

export {
  setCanvasReference,
  setGraphContainerReference,
  setSvgBackgroundReference
};
