function cleanNodeAttributes(attributes) {
  return Object.keys(attributes).reduce((prev, k) => {
    if (!(k === 'vy' || k === 'vx' || k === 'index' || k === 'y' || k === 'x')) {
      prev[k] = attributes[k];
    }
    return prev;
  }, {});
}

export { cleanNodeAttributes };
