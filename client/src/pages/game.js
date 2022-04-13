/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Canvas from "../components/Canvas";
import Cols from "../components/Cols";
import Image from "../components/Image";
import Input from "../components/Input";
import Row from "../components/Row";
import Text from "../components/Text";

function GamePage(props) {
  // SETTING SOCKET
  const socket = props.socket;

  // SETTING CANVAS REFS
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // ACTIVE LINK STATE
  const [link, setLink] = useState("/");

  // WORD STATE
  const [word, setWord] = useState(null);

  // WHOS PLAYING STATE
  const [whoIsPlaying, setWhoIsPlaying] = useState();
  // ISDRAWING STATE (RENDER)
  const [isDrawing, setIsDrawing] = useState(false);

  // ISGUESSING STATE (RENDER)
  const [isGuessing, setIsGuessing] = useState(false);

  // ISWON STATE (RENDER)
  const [isWon, setIsWon] = useState(false);

  // ISFAILED STATES (RENDER)
  const [isFailed, setIsFailed] = useState(false);

  // UPDATES STATE (MESSAGES)
  const [updates, setUpdates] = useState("");

  useEffect(() => {
    // STARTUP EMITS (FOR UPDATES)
    socket.emit("whoIsPlaying");
    socket.emit("getWord");

    // UPDATING WORD IF UPDATED
    socket.on("wordUpdated", (word) => {
      setWord(word);
    });

    // HANDLING DRAW WHEN SENT
    socket.on("drawSent", (who) => {
      handleGuessing(who);
    });

    // SETTING UP NEXT GAME
    socket.on("nextGame", (whosNext, difficulty) => {
      if (whosNext === localStorage.getItem("name")) {
        handleNextGame(true, difficulty);
      } else {
        handleNextGame(false, difficulty);
      }
    });

    // SETTING WHOS PLAYING STATE
    socket.on("whoIsPlaying", async (player) => {
      if (localStorage.getItem("name") === (await player)) {
        setWhoIsPlaying(await player);
        setIsDrawing(true);
      } else {
        setIsDrawing(false);
      }
    });

    // PREVENT TOUCH SCROLL
    if (document.getElementById(canvasRef)) {
      document
        .getElementById(canvasRef)
        .addEventListener("touchstart", (e) => e.preventDefault(), {
          passive: false,
        });
      document
        .getElementById(canvasRef)
        .addEventListener("touchmove", (e) => e.preventDefault(), {
          passive: false,
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLING DRAW WHEN SENT
  const handleNextGame = (isNext, diff) => {
    setIsWon(true);
    setIsDrawing(false);
    setIsGuessing(false);
    setUpdates("Great job! (+" + diff + " points)");
    if (isNext) {
      setLink("/choose");
    } else {
      setLink("/game");
    }
    setTimeout(() => {
      if (document.getElementById("nextGame")) {
        document.getElementById("nextGame").click();
      }
    }, 10000);
  };

  // HANDLING WHOS GUESSING
  const handleGuessing = async (player) => {
    if (localStorage.getItem("name") === (await player)) {
      setIsGuessing(true);
      setIsDrawing(false);
    } else {
      setIsGuessing(false);
      setIsDrawing(false);
    }
  };

  // HANDLING WRONG ANSWER (RENDER)
  const wrongAnswer = () => {
    setIsFailed(true);
    setTimeout(() => {
      setIsFailed(false);
      if (updates === "Wrong, try again !") {
        setUpdates("");
      }
    }, 10000);
  };

  // CHECKING GUESS
  const tryGuess = () => {
    if (document.getElementById("word").value.toLowerCase() === word) {
      socket.emit("updateScore");
      setIsGuessing(false);
    } else {
      wrongAnswer();
      setUpdates("Wrong, try again !");
    }
  };

  return (
    <React.Fragment>
      {/* SETTING CANVAS IF DRAWING */}
      {isDrawing && (
        <React.Fragment>
          <Canvas
            canvasRef={canvasRef}
            contextRef={contextRef}
            word={word}
            socket={socket}
          />
        </React.Fragment>
      )}

      {/* SETTING WAITING FOR ACTION PAGE */}
      {!isGuessing && !isDrawing && !isWon && (
        <React.Fragment>
          <Row>
            <Cols size={12}>
              <Image type="logo" />
            </Cols>
          </Row>
          <Row>
            <Cols size={12}>
              <Text>
                Waiting for {whoIsPlaying ? whoIsPlaying : "player"} to take an
                action...
              </Text>
            </Cols>
          </Row>
        </React.Fragment>
      )}

      {/* SETTING GUESSING PAGE */}
      {isGuessing && (
        <React.Fragment>
          <Row>
            <Cols size={12}>
              <Text>
                <Image type="canvas" />
              </Text>
            </Cols>
          </Row>
          <Row>
            <Cols size={12}>
              <Text type={"headline"} fontsize={20}>
                Answer:
              </Text>
              <Row>
                <Input
                  id="word"
                  class={isFailed && "danger"}
                  placeholder="Enter Word"
                />
              </Row>
              <Row>
                <Button
                  id={"guess"}
                  class={isFailed && "danger"}
                  size={"large"}
                  value={"CHECK"}
                  onClick={tryGuess}
                />
              </Row>
              <Row>
                <Text>{updates}</Text>
              </Row>
            </Cols>
          </Row>
        </React.Fragment>
      )}

      {/* SETTING WINNING PAGE */}
      {isWon && (
        <React.Fragment>
          <Row>
            <Cols size={12}>
              <Image type="logo" />
            </Cols>
          </Row>
          <Row>
            <Cols size={12}>
              <Text>{updates}</Text>
              <Row></Row>
              <Row>
                <Button
                  to={link}
                  id={"nextGame"}
                  size={"large"}
                  value={"Next Game"}
                  onClick={() => {
                    setIsWon(false);
                    setUpdates("");
                  }}
                />
              </Row>
            </Cols>
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default GamePage;
