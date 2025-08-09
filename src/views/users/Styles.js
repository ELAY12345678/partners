import styled from "styled-components";
import { style } from "dom-helpers";
export const BoxWrapper = styled.div`
  margin: 4px !important;
  & .ant-card-body {
    padding: 8px !important;
    padding-top: 0px !important;
  }
  & .ant-card-head {
    min-height: auto !important;
    padding: 4px !important;
    border-bottom: 0px !important;
  }
  & .ant-card-head-title {
    padding: 4px !important;
    font-size: 20px;
    font-weight: 500;
  }
  & .ant-card-bordered {
    border: 1px solid #e8e8e8b3 !important;
    border-radius: 8px !important;
    box-shadow: 2px 2px 2px #cccccc59 !important;
  }
`;
export const WrapperForm = styled.div``;
export const Wrapper = styled.div`
  & .mr-2 {
    display: flex;
    justify-content: center;
  }
`;
export const WrapperStatusField = styled.div`

&.status-field.inactive span{
  color:red
}
`;
