import React, {useRef, useState, forwardRef, useImperativeHandle} from "react";

import 'emoji-mart/css/emoji-mart.css'
import { Emojione } from "react-emoji-render";

import "./Input.css";
import EmojiPicker from "./EmojiPicker/EmojiPicker";

import TextareaAutosize from "react-textarea-autosize";

const Input = forwardRef(({message, setMessage, sendMessage, startTyping, stopTyping}, ref) => {

    const [ inputValue, setInputValue ] = useState(message);
    const [ isEmojiPickerShown, setIsEmojiPickerShown ] = useState(false);
    const [ randomEmoji, setRandomEmoji] = useState("😂");
    const [ typingTimeout, setTypingTimeout ] = useState(false);

    // show / hide emoji picker
    const toggleEmojiPicker = () => {
        setIsEmojiPickerShown(() => !isEmojiPickerShown);
    };

    // array for random emoji on the button that shows emoji picker
    const pickerButtonEmojiArray = ["😂","😝","😁","😱"];

    // get a random emoji to display on the button that opens emoji picker
    const getRandomEmoji = () => {
        let randomInt = Math.floor(pickerButtonEmojiArray.length * Math.random());
        setRandomEmoji(pickerButtonEmojiArray[randomInt]);
    };



    // our ref to the input for direct access to the DOM element
    const textInputRef = useRef();


    // this function lets focus the input when we need it
    // i.e. whe we reply to somebody and
    useImperativeHandle(ref, () => ({
        focusInput() {
            textInputRef.current.focus();
        },
        setInputValueWrapper(value) {
            setInputValue(value);
        }
    }));

    // general function to insert some data into the input at the cursor position
    const insertIntoInput = (dataToInsert) => {
        let inputValue = textInputRef.current.value;
        const inputCaretPosition = textInputRef.current.selectionStart;
        let inputValueWithDataInserted = inputValue.slice(0, inputCaretPosition) + dataToInsert.native + inputValue.slice(inputCaretPosition);
        setInputValue(inputValueWithDataInserted);
    };

    // same as above but for emoji
    const insertEmojiIntoInput = (emojiToInsert) => {
        insertIntoInput(emojiToInsert);
        toggleEmojiPicker();
        textInputRef.current.focus();
    };


    // handle pressing Enter to send message and other keys to
    // display typing notification
    let timeout;
    const handleEnter = (event) => {

        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(event, inputValue);
            setInputValue("");
            clearTimeout(timeout);
            stopTyping();
            setTypingTimeout(false);

        } else {

            // set a time interval between updates of the typing status
            clearTimeout(timeout);

            if (!typingTimeout) {
                startTyping();
                setTypingTimeout(true);

                timeout = setTimeout(() => {
                    stopTyping();
                    setTypingTimeout(false);
                }, 3000);
            }


        }
    };


    const handleChange = (event) => {
        setInputValue(event.target.value);
    };


    return (
        <form className="input">

            <TextareaAutosize
                minRows={1.5}
                maxRows={7}
                placeholder="Type your message..."
                onChange={handleChange}
                ref={textInputRef}
                value={inputValue}
                onKeyPress={handleEnter}
            />

            {isEmojiPickerShown
                ? <EmojiPicker insertEmojiIntoInput={insertEmojiIntoInput} setIsEmojiPickerShown={setIsEmojiPickerShown} />
                : null}

            <button type="button" className="emojiPickerBtn" onMouseEnter={getRandomEmoji} onClick={toggleEmojiPicker}>
                <Emojione svg text={randomEmoji}/>
            </button>

        </form>
    )
});

export default Input;