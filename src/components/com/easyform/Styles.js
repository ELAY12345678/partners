import styled from 'styled-components';
import { Form } from "antd";

export const FormWrapper = styled(Form)`
    margin:10px!important;
    padding:10px 20px!important;
    &.form-bordered{
        box-shadow:3px 3px 3px rgba(0,0,0,.04);
        border-radius:8px;
        border:1px solid rgba(0,0,0,.1);
    }
    &.ant-form-horizontal .ant-form-item{
        display:inline-block;
        margin:0px;
    }
    &.ant-form-horizontal .ant-form-item .ant-col{
        padding:0px 4px;
    }
    & .form-group-submit{
        margin:10px!important;
    }
    & .ant-form-item input, .ant-input:active{
        border-radius: 12px!important;
        background: #f4f7f8!important;
        transition: all .25s ease!important;
        border: 1px solid transparent!important;
        color: #546067!important;
    }
    & .ant-form-item input:focus{
        box-shadow: none!important;
    }
`;