import React from 'react'

import { Graph } from 'graphik';

import 'graphik/dist/index.css'

const nodeData = [
  {
      id: 'FOO',
      name: 'Test 1',
      location: 'Africa',
      fill: '#cc6133',
      x: 60,
      y: 40,
  },
  {
      id: 'BAR',
      name: 'Test 2',
      location: 'Europe',
      x: 20,
      y: 40,
  }
]; 

const edgeData = [
  {
    source: 'FOO',
    target: 'BAR',
    weight: 50
  }
];

const data = {
  nodes: nodeData,
  edges: edgeData
}

const App = () => {
  return <Graph data={data}/>
}

export default App