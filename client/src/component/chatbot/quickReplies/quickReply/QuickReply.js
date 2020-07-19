import React from "react";

const QuickReply = props => {
  if (props.reply.payload) {
    return (
      <a
        href="#"
        className="btn-floating btn-large waves-effect waves-light blue"
        onClick={event => {
          props.click(
            event,
            props.reply.payload,
            props.reply.text
          );
        }}
      >
        {props.reply.text}
      </a>
    );
  }

  return (
    <a
      href={props.reply.link}
      className="quick-reply btn-floating btn-large waves-effect waves-light blue"
    >
      {props.reply.text}
    </a>
  );
};

export default QuickReply;
