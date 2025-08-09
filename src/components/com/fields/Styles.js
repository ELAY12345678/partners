import styled from "styled-components";
import { Tag } from "antd";
export const TagWrapper = styled(Tag)`
  border-radius:0px !important;
  border:0px !important;
  padding: 4px !important;
  line-height: 8px !important;
  font-size: 14px !important;
  text-transform: none !important;
  background:transparent!important;
  /* color:var(--green)!important; */
  font-weight:normal !important;
  &.ant-tag::after {
    content: none !important;
  }
  &.inactive{
    color:var(--red)!important;
  }
  &.status.completed{
    color:var(--green)!important;
   } 
  ${({ disabled }) => disabled && `
      color:#ccc!important;
  `}


`;
export const WrapperField = styled.div`
.swatch {
  padding: "5px";
  background: "#fff";
  border-radius: "1px";
  box-shadow: "0 0 0 1px rgba(0,0,0,.1)";
  display: "inline-block";
  cursor: "pointer";
}
`;
export const WrapperFileField = styled.div`

`;
export const WrappercolorFields = styled.div`
  & .color{
    background:${({ color }) => `${color || "#FFF"}`};
    height:40px;
    border:1px solid #ccc;
    width: "36px",
    height: "14px",
    borderRadius: "2px"
  }
  & .swatch{
    padding: "5px",
    background: "#fff",
    border-Radius: "1px",
    box-Shadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer"
  }
  & .popover: {
    position: "absolute",
    zIndex: "2"
  },
  & .cover: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px"
  }
`;
