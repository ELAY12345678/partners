import React, { useState, useEffect } from "react";
import { message } from "antd";
import { URL_S3 } from "../../../constants";
const Pdf = ({ path, name, type, ...props }) => {
    return (<>
        <iframe src={`https://docs.google.com/gview?url=${URL_S3}/${path}&embedded=true`}
            style={{
                width: "80%",
                height: 600
            }}
            frameborder="0"></iframe>
    </>)
}
export default Pdf;