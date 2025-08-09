import styled from "styled-components";

export const WrapperList = styled.div`
  & .header-section {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  & .header-section h3 {
    font-size: 20px;
    margin-right: 4px;
    margin-bottom: 0px;
    margin-left: 8px;
  }
`;
export const FormWrapper = styled.div`
  & .ant-row.form-fields .ant-col.ant-col-12.item-form.item-hidden:first-child {
    margin-bottom: 20px !important;
    margin-left: -18px !important;
  }
`;
export const WrapperSection = styled.div`
  & .list-container {
    border: 1px solid rgb(243, 243, 243) !important;
    margin-bottom: 10px !important;
  }
  & > h2 {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px !important;
    border-bottom: 1px solid #cccccc78;
    padding: 10px 0px;
  }
`;
export const WrapperItemList = styled.div`

  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius:1rem;
  background: #fff ;
  padding: 1rem;
  margin:1rem;

  /* padding: 0px;
  ${({ bordered }) =>
    bordered && `border-right: 3px solid rgba(216, 216, 216, 0.53);`}
  ${({ fullHeight }) =>
    fullHeight && `min-height:100vh;`}
    min-width: 200px !important; */

  & .list-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4px 10px;
  }
  & .list-footer button.ant-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 16px 4px 10px;
  }
  & .item-head-cotainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .item-head-cotainer .head-actions i {
    font-size: var(--font-size-medium);
  }
  & em.ant-list-item-action-split {
    display: none !important;
    width: 0px !important;
    margin: 0px !important;
    padding: 0px !important;
  }
  & .ant-list-item-action > li {
    padding: 0px !important;
  }
  & .list-title h2 {
    line-height: 1;
    margin-bottom: 0px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.75);
  }
  & .list-description span {
    font-size: 12px;
    padding-left: 10px;
  }
`;
export const WrapperGroupList = styled.div``;
export const WrapperItem = styled.div`
  background: #fff;
  & .item-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 50px;

    border-left: 3px solid var(--color-white);
    padding: 8px 0 !important;
    padding-left: 8px !important;
    cursor: pointer;
    height: 49px !important;
    background: #fff;

    border-bottom: 1px solid #e8e8e8;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                      supported by Chrome, Edge, Opera and Firefox */
  }
  &.item-selected .item-container,
  & .item-container:hover {
    border-left: 3px solid #6B24F8 !important;
    background-color: var(--color-pink-light) !important;
  }
  & .avatar .anticon {
    font-size: 12px !important;
    color: #c0c0c0 !important;
    margin-right: 4px;
    font-weight: bold;
    font-size: 20px;
  }
  & .avatar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  & .ant-avatar {
    margin-right: 4px;
  }
  & .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }
  & .item-container .drag-handle {
    display: none;
    transition-property: opacity;
    transition-duration: 0.25s;
  }
  & .icon-drag {
    font-size: 30px !important;
    cursor: move;
  }
  & .item-container:hover .icon-right {
    display: none !important;
  }
  & .item-container:hover .drag-handle {
    /* background: #bfbfbf6e; */
    width: 22px;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    margin-right: 4px;
    color: #636363;
    font-size: 20px;
    padding: 0px;
    display: flex !important;
  }
  & .title {
    flex: 1;
    padding: 18px 0px;
  }

  & .title h4 {
    margin-bottom: 0px !important;
    font-size: 12px !important;
    line-height: 13px !important;
  }
`;
