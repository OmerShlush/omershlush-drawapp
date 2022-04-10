import Row from "../components/Row";
import Emptycol from "../components/Emptycol";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Welcome() {
  const submitHandler = (e) => {
    if (document.getElementById("username")) {
      const username = document.getElementById("username").value;
      localStorage.setItem("name", username);
    }
  };

  const [hs, setHs] = useState();

  useEffect(() => {

    fetchHS();

  }, []);

  const fetchHS = async () => {
    let newHs = [];
    const response = await fetch('http://localhost:3001/api/highScore');
    await response.json()
    .then(response => response.map((high) => {
      return newHs = [...newHs, high];
    }))
    .then(highScores => {
      setHs(highScores);
    });
    setHs(newHs);
  };

  return (
    <div className="mainBlock centered col-12">
      <Row>
        <Row>
          <div className="col-12">
            <img
              src={process.env.PUBLIC_URL + "/images/logo.png"}
              alt="Draw & Guess"
            />
          </div>
        </Row>
        <React.Fragment>
          <label className="centered" htmlFor="username">
            Player Name
          </label>
          <Row>
            <div className="col-12">
              <Emptycol cols={4} />
              <input type="text" className="col-4" id="username" />
            </div>
          </Row>
        </React.Fragment>

        <Row>
          <div className="col-12">
            <Link
              to="/waiting"
              className="btn"
              onClick={(e) => submitHandler(e)}
            >
              Join Game
            </Link>
          </div>
        </Row>
{hs &&  <Row>
        <h2>High Scores (TOP 3)</h2>

          <table className="col-12">
            <tbody>
            <tr>
              <th>Player A</th>
              <th>Player B</th>
              <th>HScore</th>
            </tr>
            <tr>
              <td>{hs[0].playerA}</td>
              <td>{hs[0].playerB}</td>
              <td>{hs[0].score}</td>
            </tr>
            <tr>
              <td>{hs[1].playerA}</td>
              <td>{hs[1].playerB}</td>
              <td>{hs[1].score}</td>
            </tr>
              <tr>
              <td>{hs[2].playerA}</td>
              <td>{hs[2].playerB}</td>
              <td>{hs[2].score}</td>
            </tr>
            </tbody>
          </table>
        </Row>}
      </Row>
    </div>
  );
}

export default Welcome;
