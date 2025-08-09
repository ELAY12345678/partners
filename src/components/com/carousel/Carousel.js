import React, { useEffect, useState, useRef } from "react";
import { Wrapper, Item, Image } from "./Styles";
import Slider from "react-slick";
import { URL_S3 } from "../../../constants";
import ReactPlayer from "react-player";
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};
const Carousel = ({ dataSource, defaultPosition = 0, render, ...props }) => {
  const [position, setPosition] = useState(defaultPosition);
  const myRef = useRef(null);
  useEffect(() => {
    if (myRef.current) myRef.current.slickGoTo(position);
  }, []);
  const defaultRender = (item, index) => {
    return (
      <Item>
        {
          <Image
            src={item.MediaURL ? item.MediaURL : `${URL_S3}/${item.url}`}
          />
        }
      </Item>
    );
  };
  return (
    <Wrapper>
      {dataSource.length > 0 ? (
        <Slider ref={myRef} {...settings}>
          {dataSource.map((item, index) => {
            if (render) return render(item, index, props);
            return defaultRender(item, index);
          })}
        </Slider>
      ) : (
        <div className="empty-image">
          <img src={`/images/house_searching.svg`} />
        </div>
      )}
    </Wrapper>
  );
};
export default Carousel;
