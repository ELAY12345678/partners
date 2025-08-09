import styled from "styled-components";

export const WrapperList = styled.div`
  & .head-tools {
    background: var(--white) !important;
    margin: 0px 8px !important;
  }
  & .item {
    padding-left: 4px;
    border-left: 3px solid transparent !important;
  }
  & .item.selected {
    border-left: 3px solid var(--color-primary) !important;
  }
  & .item-container {
  }
  & .item-color,
  .item-container {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  & .item-container > * {
    margin: 0px 4px;
  }
  & .item-price {
  }
  & .color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    padding: 4px;
    margin: 0px 4px;
  }
  & .name {
    text-transform: capitalize;
    font-size: 16px;
    font-weight: bold;
  }
`;
