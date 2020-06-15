import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { render } from "@testing-library/react";
//import ipfs from "./ipfs";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("http://localhost:5001");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfsHash: null,
      buffer: null
    };
  }
  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
    console.log("buffer");
  };

  onIPFSSubmit = async event => {
    event.preventDefault();
    console.log(this.state.buffer);
    await ipfs.add(this.state.buffer, (err, result) => {
      console.log(err);
      this.setState({ ipfsHash: result[0].hash });
    });
    console.log(this.state.ipfsHash);
  };
  render() {
    return (
      <div className="App">
        <h2>Add a file to IPFS here</h2>
        <form onSubmit={this.onIPFSSubmit}>
          <img alt="" src={`http://localhost:8080/ipfs/${this.state.ipfsHash}`} />
          <input type="file" onChange={this.captureFile} />
          <button type="submit">Submit</button>
        </form>
        <p> The IPFS hash is: {this.state.ipfsHash}</p>
      </div>
    );
  }
}

export default App;