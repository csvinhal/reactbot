import axios from "axios";
import React, { Component } from "react";
import "./Chatbot.css";

class Chatbot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  async dfTextQuery(text) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text
        }
      }
    };

    this.setState({ menssages: [...this.state.messages, says] });
    const res = await axios.post("/api/df_text_query", { text });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg
      };
      this.setState({ menssages: [...this.state.messages, says] });
    }
  }

  async dfEventQuery(event) {
    const res = await axios.post("/api/df_event_query", { event });

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: "me",
        msg
      };
      this.setState({ menssages: [...this.state.messages, says] });
    }
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
