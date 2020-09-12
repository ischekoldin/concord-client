import React, {useState} from "react";
import { Emojione } from "react-emoji-render";

import "./Message.css";
import editIcon from "../../../icons/editIcon.png";
import deleteIcon from "../../../icons/deleteIcon.png";



const Message = ({message: {user, text, time}, id, messageAction, currentUser}) => {


    // show message buttons on hover
    const [showMessageButtons, setShowMessageButtons] = useState(true);
    const toggleMessageButtons = () => {
      setShowMessageButtons(() => !showMessageButtons);
    };

    let messageButtonsClassList;
    if (showMessageButtons) {
        messageButtonsClassList = "messageButtonsWrapper";
    } else {
        messageButtonsClassList = "messageButtonsWrapper show";
    }


    // highlight messages addressed to current user
    // this is the basic classname for container
    let messageContainerClassList = "messageContainer";
    let messageTextArray = text.split(" ");
    let firstWord = messageTextArray[0];
    // users are addressed with a @ character followed by a user name
    // check if anyone is addressed
    if (firstWord[0] === "@" && firstWord.length > 1) {
        const toUser = firstWord.slice(1);
        if (toUser === currentUser) messageContainerClassList += " messageToMe";
    }


    let userNameClickHandler;
    if (user !== currentUser && user !== "admin") {
        userNameClickHandler = <p className="user" data-action="reply" onClick={messageAction}>{user}</p>
    } else {
        userNameClickHandler = <p className="user">{user}</p>
    }



    return (
        <div className={messageContainerClassList} data-id={id} onMouseOverCapture={toggleMessageButtons} onMouseOutCapture={toggleMessageButtons}>
            <div className="messageHeader">
                {userNameClickHandler}
                <p className="time">{time}</p>
                {/*we only need the context action buttons in messages from users*/}
                <div className={messageButtonsClassList}>
                    {user === currentUser ? <button
                        type="button"
                        data-action="delete"
                        onClick={messageAction}
                        className="messageButton"
                    ><img src={deleteIcon} alt="delete message"/></button> : null}
                    {user === currentUser ? <button
                        type="button"
                        data-action="edit"
                        onClick={messageAction}
                        className="messageButton"
                    ><img src={editIcon} alt="edit message"/></button> : null}
                </div>

            </div>

            <div className="messageBox">
                <p><Emojione svg size={32} text={text}/></p>
            </div>
        </div>
    )
};

export default Message;