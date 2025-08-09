import React from "react";
import { Layout, Row, Col } from "antd";
import styled from "styled-components";

const { Content } = Layout;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LayoutCanter = ({ children, ...props }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content
          style={{
            background: "var(--primary)"
          }}
        >
          <Container>{children}</Container>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutCanter;
