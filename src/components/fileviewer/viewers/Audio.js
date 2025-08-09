import React, { useState, useEffect } from "react";
import { message } from "antd";
import { URL_S3 } from "../../../constants";
import { AudioWrapper } from "../Styles";
const extensions = ['png', 'jpg', 'jpeg', 'pdf', 'mp4'];
const Audio = ({ _id, path, name, type, index, ...props }) => {

    useEffect(() => {
        stopSound();
        return () => {
            stopSound();
        }
    }, [props.playing]);

    const stopSound = () => {
        let player = document.getElementById(_id);
        if (player)
            player.pause();
    }
    return (<AudioWrapper>
        <audio
            id={_id}
            onBlur={() => {
                stopSound();
            }}
            tabindex={index}
            controls preload="auto">
            <source src={`${URL_S3}/${path}`} />
        </audio>
    </AudioWrapper>)
}
export default Audio;