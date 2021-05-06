import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { Graphix } from '.';
import Graph from './d3-tools/Graph';

import Adapter from 'enzyme-adapter-react-16';

const mockData = {
  nodes: [
    {
      id: 'SLYTHERIN',
      name: 'Slytherin',
      x: 49,
      y: 140,
      fill: '#005432'
    },
    {
      id: 'GRYFFINDOR',
      name: 'Gryffindor',
      x: 279,
      y: 141,
      fill: '#9e0000'
    }
  ],
  edges: [
    {
      source: 'SLYTHERIN',
      target: 'GRYFFINDOR',
      attributes: {
        text: 'Rivals',
        fontColour: 'white'
      }
    }]
};

const config = {
  svgCanvasWidth: 1024,
  svgCanvasHeight: 512,
  svgCanvasBackgroundColour: '#383838',
  nodeWidth: 90,
  nodeHeight: 60,
  nodeRx: 10,
  nodeColour: '#212121',
  nodeStroke: '#65d3ec',
  nodeFontColour: 'white',
  edgeStroke: 'black',
  edgeFontColour: 'white'
};

const saveFunc = () => {
  return 'saved';
};

Enzyme.configure({ adapter: new Adapter() });

describe('Graphix', () => {
  const wrapper = shallow(<Graphix data={mockData} userConfig={config} externalSaveGraph={saveFunc} />);
  const edges = wrapper.state('edges');
  const nodes = wrapper.state('nodes');

  it('is Graph rendered', () => {
    const graph = wrapper.find(Graph);
    expect(graph).toHaveLength(1);
  });

  it('are edges mapped to nodes', () => {
    expect(edges[0].source).toEqual(nodes[0]);
  });
});

describe('Graphix node functions', () => {
  let wrapper;
  let nodes;

  beforeEach(() => {
    wrapper = shallow(<Graphix data={mockData} userConfig={config} externalSaveGraph={saveFunc} />);
    nodes = wrapper.state('nodes');
  });

  it('adds new node to list', () => {
    expect(nodes).toHaveLength(2); // Checks that there are 2 nodes
    wrapper.instance().addNewNode('FOO_BAR', 'foobar', '10', '20'); // Adds a node

    expect(nodes).toHaveLength(3); // Checks that there are 3 nodes
    expect(nodes[2].id).toEqual('FOO_BAR'); // Checks that node added has id 'FOO_BAR'
  });

  it('removes node from list', () => {
    expect(nodes).toHaveLength(2); // Checks that there are 2 nodes
    wrapper.instance().removeNode({ id: 'SLYTHERIN' }); // Removes node SLYTHERIN

    nodes = wrapper.state('nodes'); // re-reads node data

    expect(nodes).toHaveLength(1); // Checks thata there is 1 node
    expect(nodes[0]).toEqual(mockData.nodes[1]); // Checks that node remaining is not the one removed.
  });
});
