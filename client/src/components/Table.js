import React from "react";
import Text from "./Text";
import Cols from "./Cols";
import Row from "./Row";
import "./Table.css";

function Table(props) {
  return (
    <Row>
      <Cols size={12}>
        <Row>
          {props.header && <Text type="headline">{props.header}</Text>}
          {props.header && <hr />}
        </Row>
        <Row>
          <table className="table">
            <tbody>
              <tr>
                {props.headlines &&
                  props.headlines.map((headline) => {
                    return (
                      <th key={headline}>
                        <Text type="headline" fontsize={16}>
                          {headline}
                        </Text>
                      </th>
                    );
                  })}
              </tr>
              {props.context.map((row, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <Text>{row.PlayerA}</Text>
                    </td>
                    <td>
                      <Text>{row.PlayerB}</Text>
                    </td>
                    <td>
                      <Text>{row.score}</Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Cols>
    </Row>
  );
}

export default Table;
