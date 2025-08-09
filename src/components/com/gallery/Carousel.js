import React, { useEffect, useState, useRef } from "react";
import { Wrapper, Item, Image } from "./Styles";
import Slider from "react-slick";
import { URL_S3 } from "../../../constants";
import ReactPlayer from 'react-player'

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
        if (myRef.current)
            myRef.current.slickGoTo(position);
    }, [])
    const defaultRender = (item, index) => {
        return <Item>
            {item.type == "image" ? <Image src={`${URL_S3}/${item.path}`} /> :
                <ReactPlayer
                    controls={true}
                    width={"100%"}
                    height={300}
                    url={`${URL_S3}/${item.path}`} />
            }
        </Item>;
    }
    return (<Wrapper>
        <Slider
            ref={myRef}
            {...settings}>
            {
                dataSource.map((item, index) => {
                    if (render) return render(item, index, props);
                    return defaultRender(item, index);
                })
            }
        </Slider>
    </Wrapper>);
}
export default Carousel;