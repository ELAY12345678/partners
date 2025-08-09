import React, { useState, useEffect } from "react";
import { message } from "antd";
import { URL_S3 } from "../../../constants";
import ReactPlayer from 'react-player'
import { VideoWrapper } from "../Styles";
const Video = ({ _id, path, name, type, ...props }) => {
    const [initialized, setInitialized] = useState(false)
    
    return (<VideoWrapper>
        <ReactPlayer
            id={_id}
            playing={false}
            stopOnUnmount={true}
            controls={true}
            url={`${URL_S3}/${path}`} {...props} />
    </VideoWrapper>)
}
export default Video;