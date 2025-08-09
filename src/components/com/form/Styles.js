import styled from "styled-components";

export const WrapperSelect = styled.div`
    ${({ display }) => {
        return `display:${display}`;
    }}
    align-items:center;
  
    & .container-button-plus{
        margin-left: 10px;
    }
`;

export const Tools = styled.div`
  display: flex;
  & .ant-btn {
    margin: 0px 4px;
  }
`;
export const HeadTitle = styled.div`
  h2 {
    font-size: 24px !important;
    font-style: italic !important;
    text-align: center !important;
    color: #ccc !important;
  }
`;