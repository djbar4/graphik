function addDefaultNodeAttributes(el, props) {
  el.attrs({
    id: d => d.id,
    height: props.nodeWidth,
    width: props.nodeHeight,
    rx: '10',
    fill: d => d.fill ? d.fill : '#6fa6de',
    class: 'node',
    stroke: 'black',
    x: props.x ? props.x : 100,
    y: props.y ? props.y : 100
  });
}

export { addDefaultNodeAttributes };
