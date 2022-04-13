import React from "react";
import Cols from "../components/Cols";
import Row from "../components/Row";
import Text from "../components/Text";

// 404 DEFAULT PAGE
const ErrorPage = () => {
  return (
    <React.Fragment>
      <Row>
        <Cols size={12}>
          <Text type="headline">404 - Page Not Found.</Text>
        </Cols>
      </Row>
    </React.Fragment>
  );
};

export default ErrorPage;
