import React, { Component } from 'react';
import D3Node from './d3-tools/D3Node';
import D3Edge from './d3-tools/D3Edge';

import styles from './styles.module.css';

export class Example extends Component {
  componentDidMount() {
    D3Node.create();
    D3Edge.create();
  }

  render() {
    return (
      <div className='root'>
        <svg className='canvas' />
      </div>
    );
  }
}
