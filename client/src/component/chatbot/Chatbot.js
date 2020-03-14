import axios from "axios";
import React, { Component } from "react";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";
import Card from "./card/Card";
import "./Chatbot.css";
import Message from "./message/Message";
import QuickReplies from "./quickReplies/QuickReplies";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;

  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };

    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

    if (!cookies.get("userID")) {
      cookies.set("userID", uuid(), { path: "/" });
    }
  }

  componentDidMount() {
    this.dfEventQuery("Welcome");
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    this.dfTextQuery(text);
  }

  async dfTextQuery(queryText) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text: queryText
        }
      }
    };

    this.setState({ messages: [...this.state.messages, says] });
    const res = await axios.post("/api/df_text_query", {
      text: queryText,
      userID: cookies.get("userID")
    });

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
        speaks: "bot",
        msg
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.cards
    ) {
      return (
        <div key={i}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div className="card-panel__container">
              <div className="col s2">
                <a
                  className="btn-floating btn-large waves-effect waves-light red"
                  href="#"
                >
                  {message.speaks}
                </a>
              </div>
              <div className="card-panel__cards">
                <div
                  className="cards__container"
                  style={{
                    width:
                      message.msg.payload.fields.cards.listValue.values.length *
                      270
                  }}
                >
                  {this.renderCards(
                    message.msg.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={message.msg.payload.fields.text || null}
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  }

  renderMessages(stateMessages) {
    if (stateMessages) {
      return stateMessages.map((message, i) =>
        this.renderOneMessage(message, i)
      );
    }

    return null;
  }

  _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      this.dfTextQuery(e.target.value);
      e.target.value = "";
    }
  }

  render() {
    return (
      <div className="chatbot-container">
        <nav>
          <div className="nav-wrapper">
            <a className="brand-logo">ChatBot</a>
          </div>
        </nav>
        <div id="chatbot" className="container__content">
          {this.renderMessages(this.state.messages)}
          <div
            ref={el => {
              this.messagesEnd = el;
            }}
            className="content__scroll-div"
          ></div>
        </div>
        <div className="col s12">
          <input
            className="container__input"
            type="text"
            placeholder="Type a message:"
            onKeyPress={this._handleInputKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default Chatbot;
