# Running Demo

Run the `npm install` command in both the root directory and /example directory.

Then using 2 separate terminals, run `npm run start` in both root directory and /example directory.

Demo will be visible on url http://localhost:3000/

# Integrating into your library

## Install

```bash
npm install --save graphik
```

## Usage

```jsx
import React, { Component } from 'react'

import Graphix from 'graphix'
import 'graphix/dist/index.css'

class Example extends Component {
  render() {
    return <Graphix 
      data={{nodes: [{"id": "Foo", "name": "Bar"}]}}/>
  }
}
```

## License

MIT © [DJbar4](https://github.com/DJbar4)
