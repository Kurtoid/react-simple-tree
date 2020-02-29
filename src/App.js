import React from 'react';
import SimpleTree from './components/SimpleTree';

// simple driver
/*
let data = {
  id: 0,
  name: "root",
  children: [
    { name: "sub1", id: 1 }, { name: "sub2", id: 2 }
  ]
}
//*/
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        { id: 1, name: "root", parent: null },
        { id: 2, name: "sub1", parent: 1, collapsed: true },
        { id: 3, name: "sub2", parent: 1 },
        { id: 4, name: "1sub1", parent: 2 },
        { id: 5, name: "1sub2", parent: 2 }
      ]
    }
  }
  render() {
    const { data } = this.state
    return (
      <div className="App">
        <SimpleTree data={data} onChange={(data) => { this.setState({ data: data }) }} />
      </div>
    );
  }
}

export default App;
