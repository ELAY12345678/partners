import styled from "styled-components";

export const Wrapper = styled.div`
  & .ant-menu-item {
    background: #fff !important;
  }
  & .ant-list {
    margin-top: 8px;
    background: #e5e5e553 !important;
    border-radius: 4px !important;
    padding: 8px !important;
  }
  & .ant-list-item {
    margin-bottom: 4px !important;
  }
`;
export const ItemWrapper = styled.div`
  margin: 0px;
  & .color-container {
    height: 40px;
    width: 40px;
    margin: 0px !important;
    padding: 4px;
    border: 4px solid #13000014;
    box-shadow: 1px 1px 1px #ccc;
    background: ${props => props.color};
  }

  & .color-background {
    background: ${props => props.color};
  }
`;
