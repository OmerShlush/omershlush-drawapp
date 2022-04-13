import React, { useEffect, useState } from "react";
import Cols from "./Cols";
import Row from "./Row";
import Text from "./Text";
import "./Canvas.css";
import Button from "./Button";
const base64url = require("base64url");

const Canvas = (props) => {
  // HANDLING PROPS
  const canvasRef = props.canvasRef;
  const contextRef = props.contextRef;
  const word = props.word;
  const socket = props.socket;

  // SETTING DEFAULT DRAW COLOR STATE
  const [drawColor, setDrawColor] = useState("black");

  // SETTING DEFAULT DRAW STATE (CANVAS DRAWING ACTION)
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    // CANVAS SETTINGS
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let scale = [0, 0];

    // SETTINGS FOR DIFFERENT DEVICES
    if (document.body.clientWidth >= 768) {
      canvas.style.width = `${canvas.width * 0.5}px`;
      canvas.style.height = `${canvas.height * 0.5}px`;
      scale = [2, 2];
    } else {
      canvas.style.width = `${canvas.width * 0.8}px`;
      canvas.style.height = `${canvas.height * 0.5}px`;
      scale = [1, 1.5];
    }

    // SETTING CANVAS CONTEXT
    const context = canvas.getContext("2d");
    context.scale(scale[0], scale[1]);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    contextRef.current = context;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RESIZING CANVAS WHEN RESIZING WINDOW
  const canvasResize = () => {
    if (canvasRef) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      if (document.body.clientWidth >= 768) {
        canvasRef.current.style.width = `${canvasRef.current.width * 0.5}px`;
        canvasRef.current.style.height = `${canvasRef.current.height * 0.5}px`;
      } else {
        canvasRef.current.style.width = `${canvasRef.current.width * 0.8}px`;
        canvasRef.current.style.height = `${canvasRef.current.height * 0.5}px`;
      }
    }
  };

  // CANVAS RESIZING LISTENER
  window.addEventListener("resize", canvasResize);

  // CANVAS START DRAWING FUNCTION ( CHECK IF TOUCH OR MOUSE)
  const startDrawing = (e) => {
    if (
      e.type === "touchstart" ||
      e.type === "touchmove" ||
      e.type === "touchend"
    ) {
      const [x, y] = [e.touches[0].pageX, e.touches[0].pageY];
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDraw(true);
    } else {
      const { offsetX, offsetY } = e;
      contextRef.current.strokeStyle = drawColor;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDraw(true);
    }
  };

  // CANVAS STOP DRAWING FUNCTION
  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDraw(false);
  };

  // CANVAS DRAWING FUNCTION (TOUCH)
  const touchDraw = (e) => {
    if (isDraw) {
      const [x, y] = [e.touches[0].pageX, e.touches[0].pageY];
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    }
  };

  // CANVAS DRAWING FUNCTION (MOUSE)
  const draw = ({ nativeEvent }) => {
    if (isDraw) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  // SETTING LINE COLOR FUNCTION
  function changeColor(color) {
    if (color === "black") {
      setDrawColor("#000000");
    } else if (color === "red") {
      setDrawColor("#ff0000");
    } else if (color === "green") {
      setDrawColor("#00b828");
    } else if (color === "blue") {
      setDrawColor("#0051ff");
    } else if (color === "yellow") {
      setDrawColor("#ffff00");
    }
    contextRef.current.strokeStyle = drawColor;
  }

  // SETTING LINE SIZE FUNCTION
  function changeLineSize(size) {
    contextRef.current.lineWidth = size;
  }

  // SETTING RESET CANVAS CONTEXT FUNCTION
  const resetDraw = (e) => {
    e.preventDefault();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  // SETTING SEND DRAW FUNCTION
  const sendDraw = async (e) => {
    e.preventDefault();
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("image/png");
    const slicedUrl = dataURL.replace("data:image/png;base64,", "");
    const urlEncoded = base64url.fromBase64(slicedUrl);
    // fetch('http://localhost:3001/api/saveCanvas/' + urlEncoded);
    socket.emit("updateCanvas", urlEncoded);
    socket.emit("changePlayer");
    socket.emit("drawSent");
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Cols size={12}>
          <canvas
            className="drawingCanvas"
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={touchDraw}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            ref={canvasRef}
            id="canvas"
          />
        </Cols>
      </Row>
      <Row>
        {word ? (
          <Text type="headline">[{word.toUpperCase()}]</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </Row>
      <Row>
        <Button
          id={"resetDraw"}
          class={"reload"}
          size={"medium"}
          value={"↻ RESET"}
          onClick={(e) => resetDraw(e, canvasRef)}
        />
        <Button
          id={"resetDraw"}
          class={"reload"}
          size={"medium"}
          value={"Send Challenge"}
          onClick={(e) => sendDraw(e, canvasRef)}
        />
      </Row>
      <Row>
        <Cols size={6}>
          <Row>
            <Text>Brush Size:</Text>
          </Row>
          <Button
            id={"smallBrush"}
            class={"brush"}
            size={"small"}
            value={"Small"}
            onClick={(e) => changeLineSize(3)}
          />
          <Button
            id={"mediumBrush"}
            class={"brush"}
            size={"medium"}
            value={"Medium"}
            onClick={(e) => changeLineSize(5)}
          />
          <Button
            id={"largeBrush"}
            class={"brush"}
            size={"large"}
            value={"Large"}
            onClick={(e) => changeLineSize(8)}
          />
        </Cols>
        <Cols size={6}>
          <Row>
            <Text>Brush Color:</Text>
          </Row>
          <Button
            id={"blackBtn"}
            class={"color-btn"}
            value={""}
            onClick={(e) => changeColor("black")}
          />
          <Button
            id={"redBtn"}
            class={"color-btn red"}
            value={""}
            onClick={(e) => changeColor("red")}
          />
          <Button
            id={"greenBtn"}
            class={"color-btn green"}
            value={""}
            onClick={(e) => changeColor("green")}
          />
          <Button
            id={"blueBtn"}
            class={"color-btn blue"}
            value={""}
            onClick={(e) => changeColor("blue")}
          />
          <Button
            id={"yellowBtn"}
            class={"color-btn yellow"}
            value={""}
            onClick={(e) => changeColor("yellow")}
          />
        </Cols>
      </Row>
    </React.Fragment>
  );
};

export default Canvas;
