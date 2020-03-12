import React, { Component } from "react";
import "./Chatbot.css";

class Chatbot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  render() {
    return (
      <div className="chatbot-container">
        <div id="chatbot" className="container__content">
          <h2>Chatbot</h2>
          <input type="text" />
        </div>
      </div>
    );
  }
}

export default Chatbot;
