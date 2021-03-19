import React from 'react'

import { Graphik } from 'graphik';

import 'graphik/dist/index.css'
import nodeData from './resources/nodes.json';
import edgeData from './resources/edges.json';


const data = {
  nodes: nodeData,
  edges: edgeData
}

const App = () => {
  return <Graphik data={data}/>
}

export default App