function addDefaultNodeAttributes(el, props) {
  el.attrs({
    id: d => `node__${d.id}`,
    height: d => d.height ? d.height : props.config.nodeHeight,
    width: d => d.width ? d.width : props.config.nodeWidth,
    rx: d => d.rx ? d.rx : props.config.nodeRx,
    class: 'node',
    stroke: d => d.stroke ? d.stroke : props.config.nodeStroke,
    fill: d => d.fill ? d.fill : props.config.nodeColour
  });
  // el.style('fill', d => d.fill ? d.fill : null);
  // el.style('stroke', d => d.stroke ? d.stroke : null);
}

function addGroceries(groceries) {
  d3.select('li')
    .data(groceries) // attach groceries data
    .enter()
    .append('ul') // create ul element for each value in groceries
    .exit()
    .remove(); // remove a ul element if there are more present than there are groceries.
}

export { addDefaultNodeAttributes };
