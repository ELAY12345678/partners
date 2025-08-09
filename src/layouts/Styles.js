import React from "react";
import { Layout } from "antd";
import styled from "styled-components";
const { Sider } = Layout;

export const WrapperPanelLayout = styled.div`
  & .ant-layout{
    background: #fff!important;
  }
  & > .ant-layout{
    border-radius: 8px!important;
    box-shadow: 2px 2px 2px #ccc!important;
    padding:0px 10px;
  }
`;
export const Wrapperlayout = styled(Layout)`
  & footer {
    background: ${props =>
    props.background ? props.background : "#f3f3f3"}!important;
    color: ${props =>
    props.background ? props.color || "#d9d9d94f" : "#292b2c"}!important;
  }
`;
export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  overflow-x: hidden !important;

  padding: 20px 5px 20px 5px;
  height: 64px;

  & .trigger {
    font-size: 20px !important;
    height: 32px !important;
    width: 32px !important;
  }
  & .trigger:hover {
    background: ${props =>
    props.background || "var(--color-primary)"}!important;
  }
  & .trigger i {
    vertical-align: text-top;
  }
`;
export const Copy = styled.p`
  text-align: center;
`;
export const SideBar = styled.div`
  /* max-width: 350px; */
  background: white!important;
  overflow-x: hidden !important;
  height: 100%;
`;
export const SiderContainer = styled(Sider)`
  
  &.ant-layout-sider {
    background:  ${props => props.position === 'right' ? 'transparent' : '#fff'};
    position: absolute;
    height: 93vh;
    z-index:101;
    right: ${props => props.position === 'right' ? 0 : 'auto'};
    width: 350px;
    box-shadow: ${props => props.position === 'right' ? 0 : '0 2px 10px -1px rgba(69, 90, 100, 0.3)'};
    overflow:auto !important;
  }

`;
export const HeaderContainer = styled.div`
  & h2 {
    color: #fff;
    margin-bottom: 0px;
  }
`;
