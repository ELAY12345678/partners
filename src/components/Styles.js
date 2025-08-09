import { Row, Tabs } from 'antd';
import styled from 'styled-components';

export const HeadLine = styled.div`
  display: flex;
  justify-content: start;
  align-items: baseline;
  flex-wrap: wrap;

  width:100%!important;

  background-color:var(--gray-dark-1)!important;
  color:#fff!important;

  & .ant-checkbox-wrapper{
    margin:0px 10px;
  }
  & h2{
    color: #fff!important;
    text-transform: uppercase!important;
    padding: 4px 10px!important;
    font-size: 16px!important;
    vertical-align: middle!important;
    margin-bottom: 0px!important;
  }
`;
export const AvatarWrapper = styled.div`

    position:relative;
   
    display: flex;
    justify-content: start;
    align-items: center;

    & .container{
      width: 34px;
      position:relative;
    }
    & .container:hover .ant-btn{
      display:inline-block;
    }
    & .ant-btn,.ant-btn:hover{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 999;
      height: 34px!important;
      display: none;
      width: 34px!important;
      background: #0010214f!important;
      color: #FFF!important;
      font-weight: bold;
      display:none;
    }
`;

export const Tools = styled.div`
    display:flex;
    justify-content: space-between;
`;
export const Box = styled(Row)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:1rem;
  background: #fff ;
  padding: 2rem;
`;
export const TabsStyled = styled(Tabs)`
    & .ant-tabs-nav{
        background-color:white;
        border-radius:1rem;
        box-shadow: rgb(0 0 0 / 10%) 0px 4px 12px;
        padding:0 1rem;
    }
`;
