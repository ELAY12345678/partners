import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import styled from "styled-components";

const Container = styled(Modal)`
  & .ant-modal-content {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    margin-bottom: 25px !important;
    border-radius: 20px !important;
  }

  & .ant-modal-header {
    background: var(--primary) !important;
    border-radius: 20px!important;
    min-height: 60px !important;
  }
  & .ant-modal-body {
    box-sizing: border-box !important;
    padding-bottom: 0px !important;
  }

  & .ant-modal-title {
    color: var(--white) !important;
    font-size: 1.125rem !important;
    font-weight: 700 !important;
  }
  /* & .modal-content.headline {
    transform: translate(0px, -60px);
  } */
  & .modal-content {
    /* width: calc(100% - 50px); */

    /* border-radius: 3px !important; */
    margin-bottom: 0px !important;

    /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important; */
    /* min-height: 80px; */
    overflow: hidden;

    /*  position: absolute; */
    display: block;

    /* background: var(--white) !important; */
    padding: 20px 5% 20px 5%;
    margin-left: auto;
    margin-right: auto;
    overflow-y: scroll;
    box-sizing: border-box !important;
  }

  & .modal-content > .ant-form {
    padding: 0px !important;
    margin: 0px !important;
    margin-bottom: 10px!important;
    border: 0px !important;
    box-shadow: none !important;
    width: 100% !important;
  }
  & .ant-modal-close {
    top: 15px !important;
    right: 15px !important;
  }
  & .ant-modal-close-x {
    color: var(--primary) !important;
    background: #C4A8FB !important;
    border-radius: 9999px;
    max-height: 25px;
    max-width: 25px;
    justify-content: center !important;
    align-items: center;
    display: flex;
  }
`;
export const MyModal = ({
  children,
  title,
  maskClosable = true,
  destroyOnClose = true,
  closable = true,
  onOk = null,
  onCancel = null,
  footer = null,
  width = 650,
  ...props
}) => {
  const [visible, setVisible] = useState(props.visible);

  useEffect(() => {
    setVisible(props.visible);
    return () => { };
  }, [props.visible]);
  return (
    <Container
      centered
      width={width}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      closable={closable}
      title={title}
      style={{ top: 20 }}
      visible={visible}
      onOk={onOk}
      onCancel={() => {
        Modal.destroyAll();
        setVisible(false);
        if (onCancel) onCancel();
      }}
      footer={footer}
    >
      {children}
    </Container>
  );
};
