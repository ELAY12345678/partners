import React from "react";
import styled from "styled-components";
import Divider from "../components/Divider";
 
import { Layout, Row, Col, Button } from "antd";
const { Footer, Content } = Layout;


const Wrapper = styled(Footer)`
  padding: 0px !important;
  /* background-color: var(--color-secundary) !important; */
  color: #fff !important;
  /* position: absolute; */
  width: 100%;
  bottom: 0 !important;
`;
const Container = styled(Row)`
  min-height: 359px;
  height: auto !important;
  background-color: var(--color-secundary) !important;
  position: relative;
  ::after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 8px;
    background-repeat-y: no-repeat;
    transform: translate(0px, -8px);
  }
`;
const ContactCard = styled.div`
  box-shadow: 0px 3px 26px #0000000f;
  border-radius: 10px !important;
  max-width: 441px;
  background-color: #fff;
  padding: 1.6875rem 1.25rem !important;
  box-sizing: content-box !important;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const WhiteButton = styled(Button)`
  background: #ffffff 0% 0% no-repeat padding-box !important;
  border-radius: 31px !important;
  opacity: 1 !important;
  height: 50px !important;

  width: 200px !important;
  color: var(--color-secundary) !important;
  border-color: var(--color-secundary) !important;
  font-size: var(--font-size-large) !important;
`;
const TextDark = styled.span`
  color: #333333;
`;


const Navigation = styled.nav`
  opacity: 0.7;
  box-sizing: content-box !important;
`;

const NavigationCol = styled(Col)`
  flex-grow: 2 !important;

  @media (max-width: 768px) {
    margin-top: 3rem;
  }
`;

const Caption = styled(Row)`
  padding-top: 2rem;
  padding-bottom: 9.125rem;
`;

const Copy = styled.span`
  letter-spacing: 0;
  color: #333333;
  opacity: 0.4;
  font: Bold 17px/17px Quicksand;
`;

const ContactCardPhoneCol = styled(Col)`
  @media (max-width: 768px) {
    margin-bottom: 0.5rem !important;
  }
`;
const Divi = styled(Divider)`
  height: 10.9em !important;
  margin: 20px !important;
  opacity: 1 !important;
  background-color: #ffffff !important;
`;
const MyFooter = () => {
  const navigation = [
    {
      title: "About us",
      items: [
        { text: "Our story", to: "/" },
        { text: "Benefits", to: "/" },
        { text: "FAQ", to: "/" }
      ]
    },
    {
      title: "Legal",
      items: [
        { text: "Our story", to: "/" },
        { text: "Benefits", to: "/" },
        { text: "FAQ", to: "/" }
      ]
    },
    {
      title: "Follow us",
      items: [
        { text: "Our story", to: "/" },
        { text: "Benefits", to: "/" },
        { text: "FAQ", to: "/" }
      ]
    }
  ];

  return (
    <Wrapper>
      {/* <Container
        justify="center"
        type="flex"
        style={{
          background: "red"
        }}
      >
        <Col span={22}>
          <Row type="flex" justify="center" align="middle" gutter={8}>
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <Divi type="vertical" />
            </div>
          </Row>
        </Col>
      </Container> */}
    </Wrapper>
  );
};

export default MyFooter;
