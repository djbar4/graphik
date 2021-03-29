import React from 'react'

import { Graphik } from 'graphik';

import 'graphik/dist/index.css'
import nodeData from './resources/nodes.json';
import edgeData from './resources/edges.json';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const data = {
  nodes: nodeData,
  edges: edgeData
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

const App = () => {
  const classes = useStyles();


  return (
  <div className={classes.root}>
  <CssBaseline />
  <Container component="main" className={classes.main}>
    <Typography id='title' variant="h2" component="h1" gutterBottom>
      Graphik
    </Typography>
    <Graphik data={data}/>
  </Container>
  <footer className={classes.footer}>
    <Container maxWidth="sm">
      <Typography variant="body1">My sticky footer can be found here.</Typography>
    </Container>
  </footer>
</div>
  )

}

export default App