import React, { useState, useEffect } from "react";
import { Carousel, Button } from "antd";
import { URL_S3, extensions } from "../../constants";
import * as viewers from "./viewers/";
import { Wrapper, ItemWrapper } from "./Styles";
import { Tools } from "../board/Styles";
import { useRef } from "react";
import ReactPlayer from 'react-player'

const FileViewer = ({ dataSource = [], onChange, ...props }) => {

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        centerMode: true,
        centerPadding: "60px",
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: props.index,
    };
    const myRef = useRef(null);
    const [index, setIndex] = useState(props.index || 0);
    const [playing, setPlaying] = useState(false);
    const renderItem = (record, index) => {
        let { path } = record;
        const type = path.substring(path.lastIndexOf(".") + 1, path.length);
        let viewer = viewers[type] || viewers["pdf"];
        return (<>
            <ItemWrapper>
                {
                    React.createElement(viewer, {
                        index,
                        playing,
                        onPlay: () => setPlaying(true),
                        ...record
                    })
                }
            </ItemWrapper>
        </>)
    }
    const handleChange = index => {
        setIndex(index);
        setPlaying(playing => (!playing))
        if (onChange)
            onChange(index)
    }
    useEffect(() => {
        setIndex(index);
    }, [props.index])
    //viewers
    return (<Wrapper>
        <Carousel
            ref={myRef}
            afterChange={handleChange}
            {...settings}>
            {
                dataSource.map(renderItem)
            }
        </Carousel>
        <Tools style={{
            justifyContent: "space-between"
        }}>
            {index > 0 && <Button className="arrow-left" onClick={() => {
                myRef.current.prev()
            }} type="link" size="large" icon="left" />}
            {index < dataSource.length - 1 && <Button className="arrow-right" onClick={() => {
                myRef.current.next()
            }} type="link" size="large" icon="right" />}
        </Tools>
    </Wrapper>)
}
export default FileViewer;