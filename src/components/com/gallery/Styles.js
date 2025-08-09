import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 500px;
  max-height: 400px;
  margin: 10px;
  & .image-container {
    overflow: hidden;
    border: 1px dashed #d6d6d6;
    padding: 4px;
    margin: 4px 0px;
    background: #f3f3f3;
    border-radius: 4px;
  }
  & .image-container img {
    height: 240px;
    object-fit: cover;
    object-position: center center;
  }
  & .image-actions {
    position: absolute;
    top: -10px;
    display: flex;
    justify-content: flex-end;
    width: calc(100% + 5px);
    align-items: center;
    background: transparent;
    padding: 4px;
    gap: 6px;
  }
  & .ant-list {
    & .ant-card-bordered {
      /* height:150px!important;    */
    }
    & .ant-card-body {
      padding: 4px 0px !important;
    }
    & .ant-card-meta-description {
      margin: 10px !important;
    }
    & .ant-card-cover {
      height: 80px !important;
      background: #ccc;
      overflow: hidden !important;
    }
    & .ant-card-meta-description > div {
      width: 100% !important;
    }
    & .ant-card-bordered ul.ant-card-actions {
      display: none !important;
    }
    & .ant-card-bordered .ant-btn {
      background: #fff !important;
      color: red !important;
    }
    & .ant-card-bordered:hover ul.ant-card-actions {
      position: absolute;
      top: 0;
      background: transparent;
      width: 100%;
      background: #0c0c0c75;
      min-height: 82px;
      display: flex !important;
      justify-content: space-between;
      align-items: center;
    }
  }
  & .slick-track {
    height: 100% !important;
  }
  & .slick-prev {
    left: 8px !important;
    z-index: 2 !important;
  }
  & .slick-next {
    right: 8px !important;
    z-index: 2 !important;
  }
  @media (max-width: 768px) {
    max-width: calc(768px - 50px);
  }
`;
export const Item = styled.div`
  width: 100%;
  padding: 0px;
  max-height: 400px !important;
`;
export const Image = styled.img`
  max-height: 350px;
  object-fit: contain !important;
  object-position: center center !important;
  width: 100% !important;

  @media (max-width: 768px) {
    object-fit: cover !important;
  }
`;
