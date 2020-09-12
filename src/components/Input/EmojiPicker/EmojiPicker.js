import React, {useRef, useEffect} from "react";

import {Picker} from "emoji-mart";

const EmojiPicker = ({insertEmojiIntoInput, setIsEmojiPickerShown}) => {


    const pickerWrapperRef = useRef();

    useEffect(() => {

        // close emoji picker on clicks outside it

        function handleClickOutside(event) {
            if (pickerWrapperRef.current && !pickerWrapperRef.current.contains(event.target)) {
                    setIsEmojiPickerShown(false);
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => document.removeEventListener("click", handleClickOutside);
    }, [pickerWrapperRef, setIsEmojiPickerShown]);



    return (
        <div className="emojiPickerr" ref={pickerWrapperRef}>
            <Picker set="apple"
                    theme="dark"
                    onSelect={insertEmojiIntoInput}
                    emoji="grinning"
                    title=" "
                    style={{position: "absolute", bottom: "80px", right: "45px" }}
            />
        </div>
    )

};


export default EmojiPicker;
