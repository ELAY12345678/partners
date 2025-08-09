import React from "react";
import { Layout, Row, Col } from "antd";
import styled from "styled-components";
const { Content } = Layout;
const Container = styled(Content)`
  margin: 20px 0px;
`;
const Body = styled.div`
  ::before {
    content: " ";
    position: absolute;
    left: 90%;
    bottom: 30%;


    width: 100%;
    height: 100%;
    background-size: auto;

    width: 400px;
    height: 250px;
    background-size: 100% 100%;

    background-repeat: no-repeat !important;
  }
`;
const BlogLayout = ({ children, ...props }) => {
  return (
    <Container>
      <Row type="flex" justify="center" align="middle">
        <Col
          span={16}
          style={{
            margin: "10px 0px",
            minHeight: 200
          }}
        >
          <Body>{children}</Body>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogLayout;
