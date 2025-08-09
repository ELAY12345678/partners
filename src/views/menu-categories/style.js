import styled from "styled-components";
import { css } from "styled-components";
import { Row } from "antd";

export const WrapperWarning = styled.div`
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.03) !important;
  border: 1px solid #e8e8e85e !important;
  border-radius: 20px;
  line-height: 27px;
  margin: 7px 10px 10px 9rem;
  width: 80%;
  color: #ffffff;
  background-color: #d60915;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const WrapperForm = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:1rem;
  background: #fff ;
  padding: 1rem;
  margin:1rem;
`;

export const Headline = styled.p`
  font-size: 0.8rem;
  color: black;
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 6px;
`;

export const WrapperListItems = styled.div`
  display: flex;
  align-items: center;
  height: auto;
  width: 100%;
  overflow: scroll;
`;

export const WrapperItem = styled.div`
  display: flex;
  width: 200px;
  margin: 0 10px 0 10px;
`;
export const Image = styled.img`
  height: 70px;
  width: 200px;
  max-width: 200px;
  border-radius: 18px;
  opacity: 0.8;
  object-fit: cover;
  object-position: center center;
  :hover {
    filter: brightness(50%) saturate(0%);
    -webkit-filter: brightness(50%) saturate(0%);
    -moz-filter: brightness(50%) saturate(0%);
    cursor: pointer;
  }
  ${({ active }) => {
    return (
      active &&
      css`
        border: 4px solid green;
        border-radius: 22px;
      `
    );
  }}
`;

export const WrapperHome = styled.div`
  display: flex;
  flex-direction: column;
  white-space: normal;
  align-items: center;
  margin-top: 0.8rem;

  cursor: pointer;
  :hover {
    transform: scale(107%);
  }
`;

export const Box = styled(Row)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:1rem;
  background: #fff ;
  padding: 2rem;
`;

export const WrapperDeliveryOptions = styled(Row)`
  border-radius: 12px !important;
  gap: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`;
export const Labels = styled.p`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: -6px
`;
