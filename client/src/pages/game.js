/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Canvas from "../components/Canvas";
import Row from "../components/Row";

function GamePage(props) {
  const socket = props.socket;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // is player drawing (render)
  const [isDrawing, setIsDrawing] = useState(false);

  // Chosen word
  const [word, setWord] = useState(null);

  // Detect who is playing
  const [whoIsPlaying, setWhoIsPlaying] = useState();

  // is player guessing (render)
  const [isGuessing, setIsGuessing] = useState(false);

  const [isWon, setIsWon] = useState(false);
  const [updates, setUpdates] = useState("");
  const [link, setLink] = useState("/");

  useEffect(() => {
    socket.emit("whoIsPlaying");

    socket.emit("getWord");

    
    socket.on("wordUpdated", (word) => {
      setWord(word);
    });
    

    
    socket.on("drawSent", (who) => {
      handleGuessing(who);
    });
    
    socket.on("nextGame", (whosNext, difficulty) => {
      if (whosNext === localStorage.getItem("name")) {
        handleNextGame(true, difficulty);
      } else {
        handleNextGame(false, difficulty);
      };
    });
    
    socket.on("whoIsPlaying", async (player) => {
      if (localStorage.getItem("name") === (await player)) {
        setWhoIsPlaying(await player);
        setIsDrawing(true);
      } else {
        setIsDrawing(false);
      }
    });
  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  
  const handleNextGame = (isNext, diff) => {
    setIsWon(true);
    setIsDrawing(false);
    setIsGuessing(false);
    setUpdates("Great job ! +" + diff + " points");
    if (isNext) {
      setLink("/choose");
    } else {
      setLink("/game");
    }
  };

  const handleGuessing = async (player) => {
    if (localStorage.getItem("name") === (await player)) {
      setIsGuessing(true);
      setIsDrawing(false);
    } else {
      setIsGuessing(false);
      setIsDrawing(false);
    }
  };

  const tryGuess = (e) => {
    if (document.getElementById("word").value.toLowerCase() === word) {
      socket.emit("updateScore");
      setIsGuessing(false);
    } else {
      setUpdates("Wrong, try again !");
    }
  };


  return (
    <div className="mainBlock centered col-12">
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

      {!isGuessing && !isDrawing && !isWon && (
        <React.Fragment>
          <Row>
            <div className="col-12">
              <img
                src={process.env.PUBLIC_URL + "/images/logo.png"}
                className="image"
                alt="Draw & Guess"
              />
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <p>
                Waiting for {whoIsPlaying ? whoIsPlaying : "player"} to take an
                action...
              </p>
            </div>
          </Row>
        </React.Fragment>
      )}

      {isGuessing && (
        <React.Fragment>
          <Row>
            <div className="col-12">
              <p>
                <img
                  src="http://localhost:3001/api/getCanvas"
                  className="canvasImg"
                  alt="canvas"
                />
              </p>
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <form action="" className="mt-5">
                <label htmlFor="word">Enter guess:</label>
                <Row>
                  <input type="text" id="word"></input>
                </Row>
                <Row>
                  <a
                    className="btn"
                    id="wordButton"
                    onClick={(e) => tryGuess(e)}
                  >
                    Check
                  </a>
                </Row>
                <Row>
                  <p>{updates}</p>
                </Row>
              </form>
            </div>
          </Row>
        </React.Fragment>
      )}
      {isWon && (
        <React.Fragment>
          <Row>
            <div className="col-12">
              <img
                src={process.env.PUBLIC_URL + "/images/logo.png"}
                className="image"
                alt="Draw & Guess"
              />
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <form action="">
                <p>{updates}</p>
                <Row></Row>
                <Row>
                  <Link to={link} className="btn" onClick={() => {
                    setIsWon(false)
                    setUpdates('');
                  }}>
                    Next Game
                  </Link>
                </Row>
              </form>
            </div>
          </Row>
        </React.Fragment>
      )}
    </div>
  );
}

export default GamePage;
