/* eslint-disable jsx-a11y/anchor-is-valid */
import Row from "../components/Row";
import React, { useEffect, useState } from "react";

import Cols from "../components/Cols";
import Text from "../components/Text";
import Button from "../components/Button";
import Image from "../components/Image";

function Waiting(props) {
  // setting socket
  const socket = props.socket;

  // setting states
  const [isWaiting, setIsWaiting] = useState(true);
  const [link, setLink] = useState("/");
  const [updates, setUpdates] = useState("Waiting for player to join...");

  //  setting session
  const startSession = () => {
    setIsWaiting(false);
    setTimeout(() => {
      if (document.getElementById("enterGame")) {
        document.getElementById("enterGame").click();
      }
    }, 5000);
  };

  socket.on("startSession", startSession);

  // setting whos playing
  const whoIsPlaying = (data) => {
    if (data === localStorage.getItem("name")) {
      setLink("/choose");
    } else {
      setLink("/game");
    }
  };
  socket.on("whoIsPlaying", whoIsPlaying);

  // setting game is busy
  const gameIsBusy = () => {
    setUpdates("Someone is already playing...");
  };
  socket.on("busy", gameIsBusy);

  // Connection to socket and setting playername in backend
  useEffect(() => {
    socket.connect();
    socket.emit("updateName", localStorage.getItem("name"));
  });

  return (
    <Row>
      <Row>
        <Cols size={12}>
          <Image type="logo" />
        </Cols>
      </Row>
      <Row>
        <Cols size={12}>
          <Text type="headline">Draw & Guess</Text>
        </Cols>
      </Row>
      <Row>
        {!isWaiting ? (
          <Button
            to={link}
            id={"enterGame"}
            size={"large"}
            value={"Enter Game"}
          />
        ) : (
          <Text>{updates}</Text>
        )}
      </Row>
    </Row>
  );
}

export default Waiting;
