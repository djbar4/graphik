function addDefaultNodeAttributes(el) {
  el.attrs({
    height: 30,
    width: 30,
    x: (d, i) => (i + 1) * 100,
    y: 40,
    rx: '10',
    fill: '#6fa6de',
    stroke: 'black',
    class: 'node'
  })
    .attrs(
      (d, i) => d
    );
}

export { addDefaultNodeAttributes };
