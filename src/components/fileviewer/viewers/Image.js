import React, { useState, useEffect } from "react";
import { message } from "antd";
import { URL_S3 ,s3PathImageHandrer} from "../../../constants";
import { ImageWrapper } from "../Styles";
const extensions = ['png', 'jpg', 'jpeg', 'pdf', 'mp4'];
const Image = ({ path, name, type, ...props }) => {
    return (<ImageWrapper>
        <img alt={name} src={`${s3PathImageHandrer}/${window.imageShark(
                        path,
                        600,
                        600
                      )}`} />
    </ImageWrapper>)
}
export default Image;