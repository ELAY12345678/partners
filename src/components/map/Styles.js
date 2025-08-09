import styled from "styled-components";

export const WraperMarker = styled.div`
  padding: 0px !important;
  & .sections-name-properties {
    font-size: 12px;
  }
  & .ant-card-meta-title {
    font-size: 11px;
  }
  & .container-neighborhood > span {
    font-size: 12px;
  }
  & .price {
    font-size: 11px;
  }
  & .ant-avatar-lg {
    width: 17px !important;
    height: 17px !important;
  }
  & .sections-description {
    min-width: 88px;
  }
  & .description {
    font-size: 13px;
  }
  & .sections-description-rooms {
    min-width: 86px;
    margin-left: 6px;
  }
  & .section-color-tag span {
    font-size: 8px;
    text-transform: uppercase;
    font-weight: bold;
  }
  & .ant-card {
    width: 210px;
    margin: 0px !important;
  }
  & .ant-card-cover {
    height: 137px !important;
  }
  & .ant-card-body {
    padding: 6px 12px 9px 12px !important;
    overflow: hidden;
  }
  & .ant-card .cover img {
    height: 138px;
  }
  & .tools {
    top: 94px !important;
  }
`;
export const Wrapper = styled.div`
   padding:0px!important;
     height:${({ height }) => height || '100px'}!important;
    height:${({ size }) => {
    switch (size) {
      case "large":
        return "100vh!important;";
        break;
      case "medium":
        return "600px!important;";
        break;
      case "small":
        return "400px!important;";
        break;
      case "tiny":
        return "200px!important;";
        break;
      default:
        return "100%!important;";
        break;
    }
  }}
    & .app-map{
        height:100% ;
    }
    
`;
export const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 4px solid #eaa29b;
`;
