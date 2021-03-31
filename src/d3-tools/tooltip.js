import * as d3 from 'd3';
import styles from '../styles.module.css';

let tooltipDiv;
let prevNode;
let tooltipActive = false;
let currNode;
let changedAttrs;

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
    enableTooltip(event.target, data, false);
    prevNode = event.target;
    tooltipActive = true;
  } else {
    disableTooltip(event.target);
    tooltipActive = false;
  }
}

function enableTooltip(node, data, editable) {
  changedAttrs = {};
  currNode = node;
  d3.select(currNode).attr('stroke', 'red');
  tooltipDiv.style('visibility', 'visible')
    .html(createHtml(data, editable));

  setButtonsToBeClickable(data);
  if (editable) setInputFieldsToChange();
  currNode.clicked = true;
};

function setButtonsToBeClickable(data) {
  d3.select(`.${styles.editTooltipButton}`)
    .on('click', () => editButtonClicked(data));

  d3.select(`.${styles.saveTooltipButton}`)
    .on('click', () => saveButtonClicked(data));

  d3.select(`.${styles.addAttributeTooltipButton}`)
    .on('click', () => addButtonClicked(data));

  d3.select(`.${styles.cancelTooltipButton}`)
    .on('click', () => cancelButtonClicked(data));
}

function setInputFieldsToChange() {
  const inputs = d3.selectAll(`.${styles.attrInput}`);
  inputs.on('input', handleInputBox);
}

function disableTooltip(node) {
  d3.select(node).attr('stroke', 'black');
  tooltipDiv.style('visibility', 'hidden');
  node.clicked = false;
};

function createHtml(data, editable) {
  let html = '';
  html += '<h1>Attributes</h1>';
  html += createAttributesHtml(data, editable);
  html += editable ? createEditModeButtonsHtml() : createEditButtonHtml();
  return html;
};

function handleInputBox(d) {
  const attr = this.getAttribute('attr');
  const newVal = this.value;
  changedAttrs[attr] = newVal;
}

function createAttributesHtml(data, editable) {
  let attrsHtml = '';
  for (const k in data) {
    if (!(k === 'vy' || k === 'vx' || k === 'index' || k === 'y' || k === 'x')) {
      attrsHtml += `<p><label>${k}:</label>`;
      attrsHtml += editable ? `<input type="text" id=${data.id}_${k} node=${data.id} attr=${k} class=${styles.attrInput} value=${data[k]}></input>`
        : `<text class=${styles.attrText}> ${data[k]} </text>`;
      attrsHtml += '</p>';
    }
  }
  return attrsHtml;
};

function editButtonClicked(data) {
  disableTooltip(currNode);
  enableTooltip(currNode, data, true);
}

function saveButtonClicked(data) {
  if (changedAttrs !== {}) {
    for (const k in changedAttrs) {
      currNode.__data__[k] = changedAttrs[k];
    }
  }

  disableTooltip(currNode);
  enableTooltip(currNode, data, false);
}

function addButtonClicked(data) {

}

function cancelButtonClicked(data) {
  disableTooltip(currNode);
  enableTooltip(currNode, data, false);
}

function createEditButtonHtml() {
  return `<button class=${styles.editTooltipButton}> Edit </button>`;
}

function createEditModeButtonsHtml() {
  let html = '';
  html += createSaveButtonHtml();
  html += createCancelButtonHtml();
  html += createAddButtonHtml();
  return html;
}

function createSaveButtonHtml() {
  return `<button class=${styles.saveTooltipButton}> Save </button>`;
}

function createCancelButtonHtml() {
  return `<button class=${styles.cancelTooltipButton}> Cancel </button>`;
}

function createAddButtonHtml() {
  return `<button class=${styles.addAttributeTooltipButton}> Add Attribute </button>`;
}

export default {
  enableTooltip,
  disableTooltip,
  createTooltip,
  displayTooltip
};
