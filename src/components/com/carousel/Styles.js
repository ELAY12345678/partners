import styled from "styled-components";
export const Wrapper = styled.div`
  /*  max-width: 500px;
  max-height: 400px;
  margin: 10px; */
  min-height: 350px;

  padding-left: 5px !important;
  padding-right: 5px !important;

  & .slick-slide {
    min-height: 350px;
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
  & .slick-dots {
    bottom: 10px !important;
  }
  & .slick-dots button {
    border-radius: 50% !important;
    background: transparent;
    height: 4px;
    width: 4px;
    padding: 3px;
    border: 2px solid #fff;
  }
  & .slick-dots .slick-active button {
    padding: 4px;
    background: var(--primary) !important;
  }
  & .slick-dots button::before {
    content: none !important;
  }
  & .empty-image img {
    max-width: 400px;
    min-height: 400px;
  }
  & .empty-image {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 768px) {
    max-width: calc(768px - 50px);
  }
`;
export const Item = styled.div`
  width: 100%;
  padding: 0px;
  background: #d9d9d9 !important;
  max-height: 350px !important;
`;
export const Image = styled.img`
  min-height: 350px;
  object-fit: contain !important;
  object-position: center center !important;
  width: 100% !important;

  @media (max-width: 768px) {
    object-fit: cover !important;
  }
`;
