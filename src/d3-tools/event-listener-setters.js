import d3ContextMenu from 'd3-context-menu';

function setContainerContextMenuEvent(background, contextMenu) {
  background.on('contextmenu', d3ContextMenu(contextMenu));
}

function setNodeContextMenuEvent(nodes, contextMenu) {
  nodes.on('contextmenu', d3ContextMenu(contextMenu));
}

function setEdgeContextMenuEvent(edges, contextMenu) {
  edges.on('contextmenu', d3ContextMenu(contextMenu));
}

function setNodeClick(nodes, isEdgeBeingCreated, setIsEdgeBeingCreated, turnNodeTooltipOn, createNewEdge, parentSvg, newEdgeProps) {
  nodes.on('click', (e) => {
    if (isEdgeBeingCreated()) {
      createNewEdge(e, parentSvg, newEdgeProps);
      setIsEdgeBeingCreated(false);
    } else {
      turnNodeTooltipOn(e);
    }
  });
}

function setEdgeClick(edges, turnEdgeTooltipOn) {
  edges.on('click', (e) => {
    turnEdgeTooltipOn(e);
  });
}

export { setContainerContextMenuEvent, setNodeContextMenuEvent, setNodeClick, setEdgeContextMenuEvent, setEdgeClick };
