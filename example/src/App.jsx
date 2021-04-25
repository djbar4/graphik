import React, {Component} from 'react'
import { Graphik } from 'graphik';
import './index.css'

import 'graphik/dist/index.css'

import harryPotterData from './resources/harry_potter.json';
import orgStructureData from './resources/savedData.json';

import data from './resources/savedDataRemovedNode.json';


import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import gif from './resources/react-gif.gif'
import { Col, Row } from 'react-bootstrap';
import { RiHomeWifiLine } from 'react-icons/ri';



const rootCss = {
      flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Segoe UI'

}

const footerCss = {
      padding: '1px',
    backgroundColor: '#868686'

}


const orgStructureConfig = {
  nodeWidth: 60,
  nodeHeight: 60,
  nodeRx: 10,
  nodeColour: '#212121',
  nodeStroke: '#65d3ec',
  svgCanvasWidth: 1032,
  svgCanvasHeight: 594,
  svgCanvasBackgroundColour: '#383838',
  nodeFontColour: 'white'
}

const harryPotterConfig = {
  nodeWidth: 60,
  nodeHeight: 60,
  nodeRx: 10,
  nodeColour: '#212121',
  nodeStroke: '#65d3ec',
  svgCanvasWidth: 1032,
  svgCanvasHeight: 594,
  svgCanvasBackgroundColour: '#383838',
  nodeFontColour: 'white'
  // svgCanvasBackgroundColour: '#ffe2c9'
}


const saveData = (data) => {
  console.log("🚀 ~ data", data)
  
  var a = document.createElement("a");
  var file = new Blob([JSON.stringify(data)], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = 'json.json';
  a.click();
}


export default class App extends Component {
  constructor(props) {
    super(props)

    this.changePage = this.changePage.bind(this);
    
    this.state = {
      data: orgStructureData,
      config: orgStructureConfig,
      key: 'org'
    };
  }

  changePage(data, config, key) {
    console.log('changed')
    this.setState({
      data,
      config,
      key
    })
  }

  render(){
    console.log('rerendered')
    console.log(this.state)
  return (
    <div className={rootCss}>
      <Navbar style={{backgroundColor: '#212121', borderBottom: '2px solid #868686'}} variant="dark">
      <Navbar.Brand >
      <img
        alt=""
        src={gif}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      Graphix</Navbar.Brand>
      </Navbar>
      <div>
        <Container style={{padding: 0}}>
          <Row noGutters>
          <Col xs={2} style={{backgroundColor: '#212121', borderRight: '2px solid #868686'}}>
            <Nav  className="flex-column">
              <Nav.Link style={{color: '#63cee6'}} onSelect={() => this.changePage(orgStructureData, orgStructureConfig, 'org')} eventKey="link-1">Org Structure</Nav.Link>
              <Nav.Link style={{color: '#63cee6'}} onSelect={() => this.changePage(harryPotterData, harryPotterConfig, 'harry')} eventKey="link-0" >Harry Potter</Nav.Link>
              <Nav.Link style={{color: '#63cee6'}} eventKey="link-2">Link</Nav.Link>
            </Nav>
              </Col>
              <Col xs={10}>
              <CssBaseline />

              <Container component="main" style={{padding: 0}}>

                <Graphik key={this.state.key} data={this.state.data} userConfig={this.state.config} externalSaveGraph={saveData} />
              </Container>
              </Col>
          </Row>
        </Container>
      </div>

      <footer className={footerCss}>
      </footer>    
      </div>
  )
  }
}

