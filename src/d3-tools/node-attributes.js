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
}

export { addDefaultNodeAttributes };
