import './Chat.css';
import React, { useState, useEffect, useRef } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';

//let's get our components
import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages";
import Input from "../Input/Input";
import SidePanel from "../SidePanel/SidePanel";

import './Chat.css';

let socket;



const Chat = ({location}) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [messageSubmitMode, setMessageSubmitMode] = useState('send');
    const [editedMessageId, setEditedMessageId] = useState(null);

    let ENDPOINT;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        ENDPOINT = 'http://localhost:5000';
    } else {
        ENDPOINT = 'https://concord-server.herokuapp.com';
    }


    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('userJoin', {name, room}, () => {

        });

        socket.on('updateUsers', (users) => {
            setUsers(users);
        });


        //when Chat component unmounts, we emit 'disconnect'
        return () => {

            socket.emit('disconnect');
            socket.off();
        }

    }, [ENDPOINT, location.search]);


    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages =>[...messages, message]);
        });

        socket.on('updateMessages', messages => {
            setMessages(messages);
        });
    },[]);



    const restoreMessages = () => {

        const oldMessages = localStorage.getItem("messages");

        // if there're no old messages, there's no need to restore them
        if (oldMessages) {

            // localStorage only stores strings and we need to parse them
            const parsedOldMessages = JSON.parse(oldMessages);
            const parsedOldMessagesLength = parsedOldMessages.length;
            // sometimes there is an empty entry, which we don't need to handle
            if (parsedOldMessagesLength > 0) {

                // the last item of the array holds the user and room of the stored messages
                const {
                    name: oldMessagesName,
                    room: oldMessagesRoom
                } = parsedOldMessages[parsedOldMessagesLength - 1];

                // these states are not assigned yet, so we have to do it here, locally
                const {name, room} = queryString.parse(location.search);

                if (oldMessagesName === name && oldMessagesRoom === room) {

                    parsedOldMessages.pop();
                    setMessages(parsedOldMessages);
                }

            }

        }

    };





    const storeMessages = () => {

        // we only use this storage for the last user,
        // so we don't need to keep the old data
        localStorage.removeItem("messages");

        // this will prevent mutating the actual messages
        let messagesToStore = messages.slice(0);
        // this element at the end of the array helps to identify the last user
        messagesToStore.push({"name": name, "room": room});
        let messagesToStore_String = JSON.stringify(messagesToStore);

        localStorage.setItem("messages", messagesToStore_String);
    };

    // whenever the messages change we need to store them in case of oopsies
    // as a user logs in, we always have the greeting message from admin
    useEffect(() => {
        if (messages.length > 1) {
            storeMessages();
        } else if (messages.length === 1) {
            restoreMessages();
        }

    },[messages]);


    //function for sending new messages and editing old ones
    const sendMessage = (event, message) => {

        console.log(`sendMessage handler ${message}`);
        if (message) {
            // if we want to edit a message we will change its entry in [messages] instead of pushing
            // a new one there
            if (messageSubmitMode === "edit") {
                messages[editedMessageId].text = message;
                setEditedMessageId(null);
                setMessageSubmitMode("send");

                socket.emit('updateMessages', messages);
            } else {
                socket.emit('sendMessage', message, () => {

                });

            }

        }
    };

    // Message functions
    // The functions for message manipulation use methods passed to child elements
    // to get the IDs of those elements
    const inputRef = useRef();

    //function for removing own messages for all users
    const removeMessage = (id) => {
        const messagesWithoutUser = messages.slice(0);
        messagesWithoutUser.splice(id, 1);
        setMessages(messagesWithoutUser);
        setMessageSubmitMode("send");

        socket.emit('updateMessages', messagesWithoutUser);
    };

    // function for editing messages
    // it puts out Input component into
    const editMessage = (id) => {
        const messageToEdit = messages[id].text;
        inputRef.current.setInputValueWrapper(messageToEdit);
        setMessageSubmitMode("edit");
        setEditedMessageId(id);
        inputRef.current.focusInput();
    };

    const replyToMessage = (id) => {
        const userToReply = messages[id].user;
        inputRef.current.setInputValueWrapper(`@${userToReply} `);
        inputRef.current.focusInput();
    };


    const startTyping = () => {
        socket.emit('typing', true);
    };
    const stopTyping = () => {
        socket.emit('typing', false);
    };





    return (
        <div className="outerContainer">

            <div className="chatWindowWrapper">

                <InfoBar room={ room } />

                <div className="sidePanelWrapper">
                    <div className="sidePanel">
                        <SidePanel users={users} />
                    </div>
                </div>

                <div className="chatBoxWrapper">
                    <div className="chatBox">
                        <Messages
                            messages={messages}
                            removeMessage={removeMessage}
                            editMessage={editMessage}
                            replyToMessage={replyToMessage}
                            currentUser={name} />
                    </div>
                        <Input
                            sendMessage={sendMessage}
                            ref={inputRef}
                            startTyping={startTyping}
                            stopTyping={stopTyping} />
                </div>

            </div>
        </div>
    )
};

export default Chat;