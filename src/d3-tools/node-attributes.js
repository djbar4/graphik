function addDefaultNodeAttributes(el, props) {
  el.attrs({
    id: d => `node_${d.id}`,
    height: props.config.nodeWidth,
    width: props.config.nodeWidth,
    rx: props.config.nodeRx,
    class: 'node',
    stroke: d => d.stroke ? d.stroke : props.config.nodeStroke,
    fill: d => d.fill ? d.fill : props.config.nodeColour
  });
  // el.style('fill', d => d.fill ? d.fill : null);
  // el.style('stroke', d => d.stroke ? d.stroke : null);
}

export { addDefaultNodeAttributes };
