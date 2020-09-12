import React, { useState } from "react";
import {Link} from "react-router-dom";

import './Join.css';

const Join = () => {
    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState('');




    const clickHandler = (event => (!name || !room) ? event.preventDefault() : null);

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <form>

                    <div><input placeholder="Name"
                                className="joinInput"
                                type="text"
                                autoComplete="on"
                                onChange={(event) => setName(event.target.value)}
                    /></div>

                    <div><input placeholder="Room"
                                className="joinInput mt-20"
                                type="text"
                                autoComplete="on"
                                onChange={(event) => setRoom(event.target.value)}
                    /></div>

                    <Link onClick={clickHandler} to={`/chat?name=${name}&room=${room}`}>
                        <button className="button mt-20" type="submit">Join</button>
                    </Link>
                </form>
            </div>
        </div>
    )
};

export default Join;