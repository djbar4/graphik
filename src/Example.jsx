import React, { Component } from 'react';
import styles from './styles.module.css';

export class Example extends Component {
  render() {
    return <div className={styles.test}>{this.props.text}</div>;
  }
}
