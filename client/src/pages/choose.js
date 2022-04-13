/* eslint-disable jsx-a11y/anchor-is-valid */
import Row from "../components/Row";
import React, { useEffect, useState } from "react";
import Cols from "../components/Cols";
import Text from "../components/Text";
import Button from "../components/Button";

function Choose(props) {
  // SETTING SOCKET
  const socket = props.socket;

  // SETTING DIFFICULTY STATE
  const [diff, setDiff] = useState("easy");

  // SETTING LOADING STATE
  const [isLoading, setIsLoading] = useState(true);

  // SETTING WORDLIST ARRAY STATE
  const [wordlist, setWordList] = useState([]);

  // SETTING ACTIVE DIFFICULTY STATE (FOR ACTIVE DIFFICULTY BUTTON)
  const [isActive, setIsActive] = useState("easy");

  // SETTING ACTIVE WORD STATE (FOR ACTIVE WORD BUTTON)
  const [isActiveWord, setIsActiveWord] = useState();

  // SETTING FUNCTION FOR FETCHING WORDS FROM API
  async function fetchApi() {
    const response = await fetch("http://localhost:3001/api/words/" + diff);
    await response
      .json()
      .then((response) => {
        return response.words;
      })
      .then((data) => {
        setWordList(data);
        setIsActiveWord(data[0]);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // FIRST FETCHING WHEN LOADING PAGE
    fetchApi();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SETTING DIFFICULTY BY PRESSING
  const difficultyHandler = (e) => {
    setDiff(e.target.id);
    setIsActive(e.target.id);
    socket.emit("updateDiff", e.target.id);
    fetchApi();
  };

  // SETTING WORD BY PRESSING
  const wordHandler = (e) => {
    e.preventDefault();
    setIsActiveWord(e.target.id);
    socket.emit("updateWord", e.target.id);
  };

  return (
    <Row>
      <Row>
        <Cols size={12}>
          <Row>
            <Cols size={12}>
              <Text type="headline" fontsize={18}>
                Choose level:
              </Text>
            </Cols>
          </Row>
          <Row>
            <Cols size={12}>
              <Button
                id="easy"
                size={"medium"}
                isActive={isActive === "easy" && "active"}
                onClick={(e) => difficultyHandler(e)}
                value="easy"
              />
              <Button
                id="medium"
                size={"medium"}
                isActive={isActive === "medium" && "active"}
                onClick={(e) => difficultyHandler(e)}
                value="medium"
              />
              <Button
                id="hard"
                size={"medium"}
                isActive={isActive === "hard" && "active"}
                onClick={(e) => difficultyHandler(e)}
                value="hard"
              />
            </Cols>
          </Row>
        </Cols>
      </Row>
      {/* SHOWING WORDS IF ISNT LOADING OR WAITING */}
      {!isLoading ? (
        <React.Fragment>
          <Row>
            <Cols size={12}>
              <Row>
                <Cols size={12}>
                  <Text type="headline" fontsize={18}>
                    Choose Word:
                  </Text>
                </Cols>
              </Row>
              <Row>
                <Cols size={12}>
                  <Button
                    id={wordlist[0]}
                    size={"small"}
                    isActive={isActiveWord === wordlist[0] && "active"}
                    onClick={(e) => wordHandler(e)}
                    value={wordlist[0]}
                  />
                  <Button
                    id={wordlist[1]}
                    size={"small"}
                    isActive={isActiveWord === wordlist[1] && "active"}
                    onClick={(e) => wordHandler(e)}
                    value={wordlist[1]}
                  />
                  <Button
                    id={wordlist[2]}
                    size={"small"}
                    isActive={isActiveWord === wordlist[2] && "active"}
                    onClick={(e) => wordHandler(e)}
                    value={wordlist[2]}
                  />
                </Cols>
              </Row>
            </Cols>
          </Row>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Text>Loading words...</Text>
        </React.Fragment>
      )}
      <Row>
        <Row>
          <Cols size={12} />
        </Row>
        <Cols size={12}>
          <Button to="/game" id={"toGame"} size={"large"} value={"Continue"} />
        </Cols>
      </Row>
    </Row>
  );
}

export default Choose;
