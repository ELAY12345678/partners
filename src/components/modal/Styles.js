import styled from 'styled-components';
import { Modal } from 'antd';

export const Wrapper = styled(Modal)`
    ${
    ({ transparent }) => {
        if (transparent)
            return `
                & .ant-modal-content, .ant-modal-header {
                    background-color: transparent!important;
                    box-shadow: none!important;
                }
                & .ant-modal-header {
                    border-bottom: 0px!important;
                }
                & .ant-modal-body {
                    height: 85vh!important;
                    padding-top: 50px!important;
                }
                & .ant-modal-footer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #FFF!important;
                    border-top: 0px!important;
                }
                & .ant-list-item-meta-title{
                    color: rgb(255 255 255);
                    text-align:left;
                }
                & .ant-btn-link, .ant-btn-link:hover, .ant-btn-link:focus{
                    color: rgb(255 255 255)!important;
                }
                & .ant-list-item-meta-description {
                    color: rgb(255 255 255 / 90%);
                }
                & .ant-modal-close-x {
                    font-size: 24px;
                    color: #bbb;
                }
            `;
    }
    }
`;