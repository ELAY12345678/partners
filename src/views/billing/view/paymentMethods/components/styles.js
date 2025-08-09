import styled from "styled-components";
import { Button, Modal, Typography } from "antd";

export const StyledModal = styled(Modal)`
    & .ant-modal-content {
    border-radius: 10px !important; 
    overflow: hidden;
    padding: 0px 20px;
    }

    & .ant-modal-header {
    color: black !important;
    display: grid;
    place-content: center;
    min-height: 60px !important;
    }

    & .ant-modal-body {
    padding: 37px;
    padding-top: 20px !important; 
    }

    & .ant-modal-title {
    color: black !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    text-align: center !important;
    }
    & .modal-content.headline {
    transform: translate(0px, -60px);
    }
    & .modal-content {
    margin-bottom: 0px !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    overflow: hidden;
    display: block;
    padding: 20px 5% 20px 5%;
    margin-left: auto;
    margin-right: auto;
    overflow-y: scroll;
    box-sizing: border-box !important;
    }

    & .modal-content > .ant-form {
    }
    & .ant-modal-close {
    top: 15px !important;
    right: 15px !important;
    }
    & .ant-modal-close-x {
    color: #202020 !important;
    background: #F0EFEF !important;
    padding: 15px;
    border-radius: 9999px;
    max-height: 25px;
    max-width: 25px;
    justify-content: center !important;
    align-items: center;
    display: flex;
    }
    & .ant-modal-footer{
    border-top: 0px;
    padding: 0px 0px;
    padding-bottom: 28px;
    }
`;

export const PaymentOptionStyled = styled(Button)`
  border-radius: 10px !important; 
  height: auto;
  padding: 18px 30px;
  gap: 8px;
  display: flex !important;
  flex-direction: column !important;
  align-items:flex-start !important;
`;

export const FormContainerStyled = styled.div`
    padding: 20px 20px;
    border: 1px solid #F0EFEF;
    border-radius: 10px;
    margin-bottom: 30px;

    & .ant-form-item{
    margin-bottom: 30xpx;
    }
    & div {
    margin-bottom: 30xpx;
    }
`;

export const Title = styled(Typography.Title)`
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  color: black;
  margin: 15px 0px !important;
`;

export const CreditCardContainerStyled = styled.div`
background: white;
border: 1px solid #F0EFEF;
padding: 15px;
border-radius: 6px;
display: flex;
flex-direction: column;
gap: 17px;
max-width: 350px;
height: 180px;
`;