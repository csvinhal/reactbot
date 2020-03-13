import axios from "axios";
import React, { Component } from "react";
import "./Chatbot.css";
import Message from "./Message/Message";

class Chatbot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    this.dfEventQuery("Welcome");
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

    this.setState({ messages: [...this.state.messages, says] });
    const res = await axios.post("/api/df_text_query", { text });

    for (let msg of res.data.fulfillmentMessages) {
      says = {
        speaks: "bot",
        msg
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  async dfEventQuery(event) {
    const res = await axios.post("/api/df_event_query", { event });

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: "me",
        msg
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  renderMessages(stateMessages) {
    if (stateMessages) {
      console.log("passou aqui", stateMessages);
      return stateMessages.map((message, i) => {
        return (
          <Message
            key={i}
            speaks={message.speaks}
            text={message.msg.text.text}
          />
        );
      });
    }

    return null;
  }

  render() {
    return (
      <div className="chatbot-container">
        <div id="chatbot" className="container__content">
          <h2>Chatbot</h2>
          {this.renderMessages(this.state.messages)}
          <input type="text" />
        </div>
      </div>
    );
  }
}

export default Chatbot;
