import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { WrapperFileField } from "./Styles";
import { URL_DEFAULT_AVATAR, URL_S3, s3PathImageHandrer } from '../../../constants';

const FileField = ({ source, record, reference, ...props }) => {
    const [image, setImage] = useState();
    useEffect(() => {
        if (record) {
            let image = record[source] ? `${s3PathImageHandrer}/${window.imageShark(
                record[source],
                100,
                100
            )}` : URL_DEFAULT_AVATAR;
            setImage(image);
        }
    }, []);
    useEffect(() => {
        if (props.defaultValue) {
            setImage(`${s3PathImageHandrer}/${window.imageShark(
                record[source],
                100,
                100
            )}`);
        }
    }, [props.defaultValue])
    return (<WrapperFileField>
        <Avatar
            src={image}
            size="large"
            shape="square"
            {...props}
        />
    </WrapperFileField>);
}
export default FileField;