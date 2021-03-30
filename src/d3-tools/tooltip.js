import * as d3 from 'd3';
import styles from '../styles.module.css';

let tooltipDiv;
let prevNode;
let tooltipActive = false;

function createTooltip() {
  tooltipDiv = d3.select('#tooltip').append('div')
    .attr('class', styles.tooltip)
    .style('visibility', 'hidden');
}

function displayTooltip(event, data) {
  if (prevNode && event.target !== prevNode) {
    disableTooltip(prevNode);
    tooltipActive = false;
  }

  if (!tooltipActive) {
    enableTooltip(event.target, data);
    prevNode = event.target;
    tooltipActive = true;
  } else {
    disableTooltip(event.target);
    tooltipActive = false;
  }
}

function enableTooltip(node, data) {
  console.log(data);
  d3.select(node).attr('stroke', 'red');
  tooltipDiv.style('visibility', 'visible')
    .html(createHtml(data)
    );
  node.clicked = true;
};

function disableTooltip(node) {
  d3.select(node).attr('stroke', 'black');
  tooltipDiv.style('visibility', 'hidden');
  node.clicked = false;
};

function createHtml(data) {
  let html = '';
  html += '<h1>Attributes</h1>';
  html += createAttributesHtml(data);
  return html;
};

function createAttributesHtml(data) {
  let attrsHtml = '';
  for (const k in data) {
    if (!(k === 'vy' || k === 'vx' || k === 'index' || k === 'y' || k === 'x')) {
      attrsHtml += `<p><label>${k}:</label><input type="text" value=${data[k]}></input></p>`;
    }
  }
  return attrsHtml;
};

export default {
  enableTooltip,
  disableTooltip,
  createTooltip,
  displayTooltip
};
