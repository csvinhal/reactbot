import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
      messages: [],
      showBot: true,
      shopWelcomenSent: false,
      shopWelcomeSent: false,
      clientToken: false,
      regenerateToken: 0,
    };

    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    if (!cookies.get("userID")) {
      cookies.set("userID", uuid(), { path: "/" });
    }
  }

  resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), x * 1000);
    });
  }

  async componentDidMount() {
    this.dfEventQuery("Welcome");

    if (window.location.pathname === "/shop" && !this.state.shopWelcomenSent) {
      await this.resolveAfterXSeconds(1);
      this.dfEventQuery("WELCOME_SHOP");
      this.setState({ shopWelcomenSent: true, showBot: true });
    }

    this.props.history.listen(() => {
      if (
        this.props.history.location.pathname === "/shop" &&
        !this.state.shopWelcomenSent
      ) {
        this.dfEventQuery("WELCOME_SHOP");
        this.setState({ shopWelcomenSent: true, showBot: true });
      }
    });
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });

    if (this.talkInput) {
      this.talkInput.focus();
    }
  }

  show(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: true });
  }

  hide(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: false });
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case "recommend_yes":
        this.dfEventQuery("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        this.dfEventQuery("MASTERCLASS");
        break;
      default:
        this.dfTextQuery(text);
        break;
    }
  }

  async dfTextQuery(text) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text,
        },
      },
    };

    this.setState({ messages: [...this.state.messages, says] });

    const request = {
      queryInput: {
        text: {
          text,
          languageCode: "en-US",
        },
      },
    };
    await this.dfClientCall(request);
  }

  async dfEventQuery(event) {
    const request = {
      queryInput: {
        event: {
          name: event,
          languageCode: "en-US",
        },
      },
    };
    await this.dfClientCall(request);
  }

  async dfClientCall(request) {
    try {
      if (!this.state.clientToken) {
        const res = await axios.get("/api/get_client_token");
        this.setState({ clientToken: res.data.token });
      }

      if (
        !process.env.REACT_APP_GOOGLE_PROJECT_ID ||
        !process.env.REACT_APP_DF_SESSION_ID
      ) {
        console.log(`Can't read from env variable`);
        throw Error;
      }

      const axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.state.clientToken}`,
        },
      };
      const googleProjetId = process.env.REACT_APP_GOOGLE_PROJECT_ID;
      const session =
        process.env.REACT_APP_DF_SESSION_ID + cookies.get("userID");

      const res = await axios.post(
        `https://dialogflow.googleapis.com/v2/projects/${googleProjetId}/agent/sessions/${session}:detectIntent`,
        request,
        axiosConfig
      );

      for (let msg of res.data.queryResult.fulfillmentMessages) {
        const says = {
          speaks: "bot",
          msg,
        };
        this.setState({ messages: [...this.state.messages, says] });
      }
      this.setState({ regenerateToken: 0 });
    } catch (e) {
      if (e.response.status === 401 && this.state.regenerateToken < 1) {
        this.setState({ clientToken: false, regenerateToken: 1 });
        this.dfClientCall(request);
      } else {
        const says = {
          speaks: "bot",
          msg: {
            text: {
              text: `I'm having troubles. I need to terminate. Will be back later`,
            },
          },
        };
        this.setState({ messages: [...this.state.messages, says] });

        setTimeout(() => {
          this.setState({ showBot: false });
        }, 2000);
      }
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.cards
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
                    width: message.msg.payload.cards.length * 270,
                  }}
                >
                  {this.renderCards(message.msg.payload.cards)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.quick_replies
    ) {
      return (
        <QuickReplies
          text={message.msg.payload.text || null}
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.quick_replies}
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
    if (!this.state.showBot) {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      this.dfTextQuery(e.target.value);
      e.target.value = "";
    }
  }

  render() {
    const containerClassName = ["chatbot-container"];
    const contentClassName = ["container__content"];
    const inputClassName = ["input__container col s12"];

    if (!this.state.showBot) {
      containerClassName.push("is-closed");
      contentClassName.push("is-closed");
      inputClassName.push("is-hidden");
    }

    return (
      <div id="chatbot" className={containerClassName.join(" ")}>
        <nav>
          <div className="nav-wrapper">
            <a className="brand-logo">ChatBot</a>
            {this.state.showBot && (
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <a href="/" onClick={this.hide}>
                    Close
                  </a>
                </li>
              </ul>
            )}

            {!this.state.showBot && (
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <a href="/" onClick={this.show}>
                    Show
                  </a>
                </li>
              </ul>
            )}
          </div>
        </nav>
        <div id="chatbot" className={contentClassName.join(" ")}>
          {this.renderMessages(this.state.messages)}
          <div
            ref={(el) => {
              this.messagesEnd = el;
            }}
            className="content__scroll-div"
          ></div>
        </div>
        <div className={inputClassName.join(" ")}>
          <input
            id="user_says"
            className="element-input"
            type="text"
            placeholder="Type a message:"
            ref={(input) => {
              this.talkInput = input;
            }}
            onKeyPress={this._handleInputKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Chatbot);
