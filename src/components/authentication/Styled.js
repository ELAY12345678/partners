import { Row } from "antd";
import styled from "styled-components";
import WrappedAdvancedForm from "../com/form/AdvancedForm";

export const HeadLine = styled.div`
  text-align: center;

  & h2 {
    font-size: 1.5rem;
  }
  & img {
    margin-bottom: 1.5rem !important;
  }
`;

export const Form = styled(WrappedAdvancedForm)`
  width: 400px;
  background: #fff;
  padding: 40px 35px !important;
  border: 1px solid #ccc;

  box-shadow: 0 2px 10px -1px rgba(69, 90, 100, 0.3);
  margin-bottom: 30px;
  transition: box-shadow 0.2s ease-in-out;

  border: 0px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;

  & .item-form {
    padding: 5px 20px !important;
  }
  & .ant-form-item input:focus {
    box-shadow: none !important;
  }
  & .ant-form-item {
    padding-bottom: 5px !important;
    margin-bottom: 5px !important;
  }
  & .ant-form-item input {
    border: 0px;
    border-radius: 0px;
    padding: 0.625rem 1.1875rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
  }
  & .login-form-button {
    text-transform: uppercase;
    font-weight: bold;

    margin-bottom: 1.5rem !important;

    border: 1px solid transparent !important;
    padding: 0.625rem 1.1875rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
    border-radius: 2px !important;
  }
`;

export const Footer = styled(Row)`
  & .ant-col {
    margin-bottom: 0.5rem !important;
  }
`;