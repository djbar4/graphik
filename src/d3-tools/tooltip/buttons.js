// import * as d3 from 'd3';
// import styles from '../../styles.module.css';
// import { disableTooltip, enableTooltip } from './tooltip';

// function setButtonsToBeClickable(node, data) {
//   d3.select(`.${styles.editTooltipButton}`)
//     .on('click', () => editButtonClicked(node, data));

//   d3.select(`.${styles.saveTooltipButton}`)
//     .on('click', () => saveButtonClicked(node, data));
// }

// function editButtonClicked(node, data) {
//   disableTooltip(node);
//   enableTooltip(node, data, true);
// }

// function saveButtonClicked(node, data) {
//   // console.log('🚀 ~ node, data', node, data);

//   // const inputAttrs = d3.select`.${styles.attrInput}`);
//   // console.log('🚀 ~ attrs ', inputAttrs);

//   // const changedAttrs = inputAttrs.;
//   // console.log('🚀 ~ changedAttrs', changedAttrs);

//   // disableTooltip(node);
//   // enableTooltip(node, data, false);
// }

// function createEditButtonHtml() {
//   return `<button class=${styles.editTooltipButton}> Edit </button`;
// }

// function createSaveButtonHtml() {
//   return `<button class=${styles.saveTooltipButton}> Save </button`;
// }

// export default {
//   setButtonsToBeClickable,
//   editButtonClicked,
//   createEditButtonHtml,
//   createSaveButtonHtml
// };
