import React, { useEffect, useState } from "react";
import Emptycol from "./Emptycol";
import Row from "./Row";
const base64url = require('base64url');


const Canvas = (props) => {
    const canvasRef = props.canvasRef;
    const contextRef = props.contextRef;
    const word = props.word;
    const socket = props.socket;

    //Change Draw Color
    const [drawColor, setDrawColor] = useState("black");

    // is player drawing (drawing)
    const [isDraw, setIsDraw] = useState(false);

    useEffect(() => {

        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let scale = [0, 0];
        if (document.body.clientWidth >= 768) {
          canvas.style.width = `${canvas.width * 0.5}px`;
          canvas.style.height = `${canvas.height * 0.5}px`;
          scale = [2, 2];
        } else {
          canvas.style.width = `${canvas.width * 0.8}px`;
          canvas.style.height = `${canvas.height * 0.5}px`;
          scale = [1, 1];
        }
        
        const context = canvas.getContext("2d");
        context.scale(scale[0], scale[1]);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 3;
        contextRef.current = context;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

      const canvasResize = () => {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        if (document.body.clientWidth >= 768) {
          canvasRef.current.style.width = `${canvasRef.current.width * 0.5}px`;
          canvasRef.current.style.height = `${canvasRef.current.height * 0.5}px`;
        } else {
          canvasRef.current.style.width = `${canvasRef.current.width * 0.8}px`;
          canvasRef.current.style.height = `${canvasRef.current.height * 0.5}px`;
        }
      };
    
      window.addEventListener("resize", canvasResize);
    
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
    
      const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDraw(false);
        console.log(contextRef.current);
      };
    
      const touchDraw = (e) => {
        if (isDraw) {
          const [x, y] = [e.touches[0].pageX, e.touches[0].pageY];
          contextRef.current.lineTo(x, y);
          contextRef.current.stroke();
        }
      };
    
      const draw = ({ nativeEvent }) => {
        if (isDraw) {
          const { offsetX, offsetY } = nativeEvent;
          contextRef.current.lineTo(offsetX, offsetY);
          contextRef.current.stroke();
        }
      };
    
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
    
      function changeLineSize(size) {
        contextRef.current.lineWidth = size;
      }
    
      const resetDraw = (e) => {
        e.preventDefault();
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      };

      const sendDraw = async (e) => {
        e.preventDefault();
        const canvas = document.getElementById("canvas");
        const dataURL = canvas.toDataURL('image/png');
        const slicedUrl = dataURL.replace('data:image/png;base64,', '');
        const urlEncoded = base64url.fromBase64(slicedUrl);
        // fetch('http://localhost:3001/api/saveCanvas/' + urlEncoded);
        socket.emit("updateCanvas", urlEncoded);
        socket.emit('changePlayer');
        socket.emit('drawSent');
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
                  <div className="centered col-12">
              <canvas
                className="drawingCanvas col-10"
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={touchDraw}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                ref={canvasRef}
                id='canvas'
                />
                </div>
              </Row>
              <Row>
            <Emptycol cols={1} />
            <div className="col-2">
              <button onClick={(e) => resetDraw(e, canvasRef)}>
                Reset Draw
              </button>
            </div>
            <div className="col-2">
              <button onClick={(e) => sendDraw(e, canvasRef)}>
                Send Challenge !
              </button>
            </div>
            <Emptycol cols={2} />
            <div className="col-2">
              {word ? <h1 className="word">"{word}"</h1> : <p>Loading...</p>}
            </div>
          </Row>
          <Row>
            <div className="col-6">
              <p>Brush Size:</p>
              <button className="size-btn" onClick={(e) => changeLineSize(3)}>
                Small
              </button>
              <button
                className="size-btn medium"
                onClick={(e) => changeLineSize(5)}
              >
                Medium
              </button>
              <button
                className="size-btn large"
                onClick={(e) => changeLineSize(8)}
              >
                Large
              </button>
            </div>
            <div className="col-6">
              <p>Brush Color:</p>
              <button
                className="color-btn"
                onClick={(e) => changeColor("black")}
              ></button>
              <button
                className="color-btn red"
                onClick={(e) => changeColor("red")}
              ></button>
              <button
                className="color-btn green"
                onClick={(e) => changeColor("green")}
              ></button>
              <button
                className="color-btn blue"
                onClick={(e) => changeColor("blue")}
              ></button>
              <button
                className="color-btn yellow"
                onClick={(e) => changeColor("yellow")}
              ></button>
            </div>
          </Row>
          </React.Fragment>
      );
};

export default Canvas;