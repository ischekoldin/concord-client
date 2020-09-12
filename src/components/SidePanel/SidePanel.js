import React from "react";
import "./SidePanel.css";

const SidePanel = ({users}) => {

    const typingIndicator = <div className="typingIndicatorContainer">
        <div className="typingIndicatorBlock">
            <div className="typingIndicatorDot"></div>
            <div className="typingIndicatorDot"></div>
            <div className="typingIndicatorDot"></div>
        </div>
    </div>;


    const list = users.map((user, i) => <div className="sidePanelUser" key={i}>{user.name} {user.isTyping ? typingIndicator : null} </div>);

    return (
        <div>{list}</div>
    )
};

export default SidePanel;