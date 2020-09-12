import React from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from "./Message/Message";

import "./Messages.css";


const Messages = ({messages, removeMessage, editMessage, replyToMessage, currentUser}) => {




    const messageAction = (event) => {
        let action = event.target.parentElement.dataset.action;
        let id = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;

        if (!action) {
            action = event.target.dataset.action;
        }

        if (!id) {
            id = event.target.parentElement.parentElement.dataset.id;
        }

        console.log(action, id);

        if (action === "delete") {
            removeMessage(id);
        } else if (action === "edit") {
            editMessage(id);
        } else if (action === "reply") {
            replyToMessage(id);
        }


    };

    const renderMessages = () => {
        let messagesToRender = [];
        let messageToRender;
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].text) {
                messageToRender = <div key={i}><Message id={i} message={messages[i]} messageAction={messageAction}
                                                currentUser={currentUser} /></div>;
                messagesToRender.push(messageToRender);
            }

        }
        return messagesToRender;
    };

    const messagesToRender = renderMessages();




    return (
    <ScrollToBottom className="messages">
        {messagesToRender}
    </ScrollToBottom>
)};

export default Messages;