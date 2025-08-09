import styled from 'styled-components';
import { Col } from "antd";

export const Container = styled(Col)`
    /* margin:8px 0px!important; */
    & .ant-card{
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
      background: #fff ;
    }
    & .ant-card-extra{
        padding:0px!important;
        margin:0px!important;
    }
    & .ant-card-head{
      min-height: 48px;
     /*  margin-bottom: -1px; */
      padding: 0 16px;
      color: #535353;
      background:#FFF!important;
      font-weight: 500;
      font-size: 18px;
      border-bottom: 1px solid #e8e8e8;
      border-radius: 6px 6px 0 0;
    }
    & .ant-card-bordered {
      border-radius: 1rem !important;
    }
    & .ant-card-head-title, .head-title {
      padding: 4px 0!important;
      color: #535353!important;
      padding: 4px!important;
    }
    & .btn-show{
        color:#fff!important;
    }
    & .head-title{
        cursor:pointer;
        /* color: var(--antd-wave-shadow-color)!important; */
    }
    & .ant-form-horizontal{
      display:flex!important;
    }
    & .ant-form-horizontal .footer-advanced-form .ant-row-flex .ant-divider  {
        display:none!important;
    }
    & .ant-form-horizontal .footer-advanced-form .login-form-button{
      margin: 15px 0px!important;
      font-size: 24px!important;
      width: auto!important;
      border-radius: 4px!important;
      padding: 4px 10px!important;
      min-height: auto!important; 
      height: auto!important;
      margin-top: 27px!important;
      margin-bottom: 0px!important;
    }
    & .ant-form-horizontal .footer-advanced-form {
        margin: 10px!important;
        padding: 10px!important;
        height: auto!important;
    }
    & .card-closed .ant-card-body {
      padding: 0px!important;
    }
    & .ant-card-body {
      padding: 10px 20px!important;
    }
    & .card-closed .ant-card-head{
      background-color:#f5f5f5!important;
    }
    ${({ xtype }) => {
    if (xtype == "fieldset")
      return `
        & .card-closed .ant-card-head{
          background-color:#FFF!important;
        }
        & .head-title{
          text-transform: capitalize!important;
        }
        & .btn-show{
          color:#535353!important;
        }
      `;
  }
  }
`;