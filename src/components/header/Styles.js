import styled from "styled-components";
import { Layout } from 'antd';

export const ActivityContainer = styled.div``;

export const HeadContainer = styled.div`
  padding: 10px 20px;

  & h2 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 18px;
    line-height: 24px;
    margin-bottom: 0px;
    line-height: 24px !important;

    color: ${props =>
    props.background
      ? props.color || "#FFF"
      : "rgba(0, 0, 0, 0.85)"}!important;
  }
  & .ant-breadcrumb-link,
  .ant-breadcrumb-separator,
  .ant-breadcrumb a {
    color: ${props =>
    props.background ? props.color || "#FFF" : "var(--gray)"}!important;
  }
`;

export const WrapperWarning = styled.div`
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.03) !important;
  border: 1px solid #e8e8e85e !important;
  border-radius: 20px;
  line-height: 27px;
  margin: 0 0 10px 1rem;
  width: 100%;
  color: #ffffff;
  background-color: #d60915;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const LogoAppartaImg = styled.img`
  width: auto;
  height: 25px;
  @media (max-width: 960px) {
    width: 0;
  }
  @media (max-width: 718px) {
    width: 20vw;
  }
`;

export const EstablishmentFilterWrapper = styled.div`
  width: 17rem;
  & .ant-select-selection-placeholder {
    color: black;
  }
  & .ant-select{
    width: 100%;
  }
  @media (max-width: 890px) {
    width: 32vw;
  }
`;

const { Header } = Layout;

export const TopHeader = styled(Header)`
  box-shadow: 0 2px 8px #C8CCD1;
  z-index:102;
  height: auto !important;
  min-height:54px !important;
  padding: 0px 0px 0px 0px !important;
  position: sticky !important;
  top: 0 !important;
  color: var(--purple) !important;
  background: var(--color-white) !important;
  & .trigger {
    font-size: var(--font-size-large);
    line-height: var(--font-size-medium);
    padding: 14px 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  & .item-menu {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .ant-dropdown-trigger i.anticon {
    font-size: 20px !important;
  }
  & .ant-dropdown-trigger .ant-badge-dot {
    top: 10px !important;
    right: 10px !important;
  }
  & .ant-dropdown-trigger {
    cursor: pointer;
    border-radius: 50% !important;
  }
   & .primary-menu-item:hover {
    color: #fff !important;
    background: var(--primary);
  } 
`;