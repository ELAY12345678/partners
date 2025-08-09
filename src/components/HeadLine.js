import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
    display: flex;
    justify-content: start;
    align-items: baseline;
    flex-wrap: wrap;
    /* background-color:var(--gray-dark-1)!important; */
    color: var(--gray-dark-1)!important;
    & .ant-checkbox-wrapper{
        margin:0px 10px;
    }
    & h2{
        color: var(--antd-wave-shadow-color);
        padding: 4px 10px!important;
        font-size: 18px!important;
        font-weight: bold;
        vertical-align: middle!important;
        margin-bottom: 0px!important;
    }
`;
const WrapperHeadLine = (props) => (<Wrapper>{props.children}</Wrapper>);
export default WrapperHeadLine;