import React from "react";
import styled from "styled-components";

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1035;

  background-color: var(--primary);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);

  & .loader-track {
    position: relative;
    height: 3px;
    display: block;
    width: 100%;
    overflow: hidden;
  }

  .loader-fill:after,
  .loader-fill:before {
    content: "";
    background: #fff;
    position: absolute;

    height: 3px;
    top: 0;
    left: 0;
    bottom: 0;
    will-change: left, right;
  }

  & .loader-fill:before {
    animation: mbar 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  }

  & .loader-fill:after {
    animation: m_s 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    animation-delay: 1.15s;
  }
`;
const loader = () => {
  return (
    <Loader className="loader-bg">
      <div className="loader-track">
        <div className="loader-fill" />
      </div>
    </Loader>
  );
};

export default loader;
