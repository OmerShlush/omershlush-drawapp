import Row from "../components/Row";
import React, { useEffect, useState } from "react";
import Cols from "../components/Cols";
import Table from "../components/Table";
import Text from "../components/Text";
import Button from "../components/Button";
import Input from "../components/Input";
import Image from "../components/Image";

function Welcome() {
  // Handle username
  const submitHandler = () => {
    if (document.getElementById("username")) {
      const username = document.getElementById("username").value;
      localStorage.setItem("name", username);
    }
  };

  // Fetching High Scores
  const [hs, setHs] = useState();

  useEffect(() => {
    fetchHS();
  }, []);

  const fetchHS = async () => {
    let newHs = [];
    const response = await fetch("http://localhost:3001/api/highScore");
    await response
      .json()
      .then((response) =>
        response.map((high) => {
          return (newHs = [...newHs, high]);
        })
      )
      .then((highScores) => {
        setHs(highScores);
      });
    setHs(newHs);
  };

  return (
    <React.Fragment>
      {/* choosing name */}
      <Row>
        <Cols size={12}>
          <Image type="logo" />
        </Cols>
      </Row>
      <React.Fragment>
        <Text type={"headline"} fontsize={20}>
          Player Name
        </Text>
        <Row>
          <Input id="username" placeholder="Enter Name" />
        </Row>
      </React.Fragment>

      <Row>
        <Cols size={12}>
          <Button
            to={"/waiting"}
            id={"enterGame"}
            type={"choice"}
            size={"large"}
            onClick={submitHandler}
            value={"Join Game"}
          />
        </Cols>
      </Row>
      {/* highscores table */}
      {hs && (
        <Row>
          <Table
            header={"High Scores (Top 3)"}
            rows={3}
            headlines={["PlayerA", "PlayerB", "HighScore"]}
            context={[
              {
                PlayerA: hs[0].playerA,
                PlayerB: hs[0].playerB,
                score: hs[0].score,
              },
              {
                PlayerA: hs[1].playerA,
                PlayerB: hs[1].playerB,
                score: hs[1].score,
              },
              {
                PlayerA: hs[2].playerA,
                PlayerB: hs[2].playerB,
                score: hs[2].score,
              },
            ]}
          />
        </Row>
      )}
    </React.Fragment>
  );
}

export default Welcome;
